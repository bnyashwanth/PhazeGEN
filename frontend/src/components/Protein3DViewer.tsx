import React, { useEffect, useRef } from "react";
// @ts-ignore
import * as $3Dmol from "3dmol";

interface Props {
  pdbUrl: string;
}

/**
 * Capture protein canvas image for PDF export
 */
export const captureProteinImage = (): string | null => {
  const canvas = document.querySelector("canvas") as HTMLCanvasElement | null;
  if (!canvas) return null;
  return canvas.toDataURL("image/png");
};

const Protein3DViewer: React.FC<Props> = ({ pdbUrl }) => {
  const viewerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // SAFETY CHECKS
    if (!viewerRef.current || !pdbUrl) return;

    // Create viewer
    const viewer = $3Dmol.createViewer(viewerRef.current, {
      backgroundColor: "#020617",
      disableFog: true,
    });

    viewer.clear();

    // Detect format
    const format = pdbUrl.endsWith(".cif") ? "cif" : "pdb";

    fetch(pdbUrl)
      .then((res) => res.text())
      .then((structureData) => {
        // Disable symmetry / assembly parsing
        viewer.addModel(structureData, format, {
          doAssembly: false,
          duplicateAssemblyAtoms: false,
        });

        // AlphaFold-style pLDDT coloring
        viewer.setStyle({}, {
          cartoon: {
            colorfunc: (atom: any) => {
              const b = atom?.b ?? 0;

              if (b >= 90) return "blue";     // very high confidence
              if (b >= 70) return "cyan";     // high
              if (b >= 50) return "yellow";   // medium
              return "red";                   // low confidence
            },
          },
        });

        viewer.zoomTo();
        viewer.render();

        // Click residue → AI explanation
        viewer.setClickable({}, true, (atom: any) => {
          if (!atom) return;

          window.dispatchEvent(
            new CustomEvent("protein-residue-click", {
              detail: {
                residue: atom.resn,
                position: atom.resi,
                chain: atom.chain,
                confidence: atom.b,
              },
            })
          );
        });
      })
      .catch((err) => {
        console.error("Protein load failed:", err);
      });

    return () => {
      viewer.clear();
    };
  }, [pdbUrl]);

  return (
    <div
      ref={viewerRef}
      style={{
        width: "100%",
        height: "100%",
        background: "#020617",
        borderRadius: "12px",
      }}
    />
  );
};

export default Protein3DViewer;
