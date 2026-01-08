import random

# --- VIRTUAL THERAPEUTIC LIBRARY ---
PHAGE_LIBRARY = [
    {"name": "T4-Like Coliphage", "target": "OmpC Receptor", "efficiency": 0.95},
    {"name": "Lambda-Zeta Variant", "target": "LamB Receptor", "efficiency": 0.88},
    {"name": "Podoviridae Rapid Lysis", "target": "LPS Layer", "efficiency": 0.92},
    {"name": "Filamentous M13-Mod", "target": "F-Pilus", "efficiency": 0.65},
    {"name": "Novel Jumbo Phage P-660", "target": "Flagella", "efficiency": 0.99}
]

ANTIBIOTIC_LIBRARY = [
    {"name": "Meropenem", "class": "Carbapenem", "target": "Cell Wall (PBP)"},
    {"name": "Ciprofloxacin", "class": "Fluoroquinolone", "target": "DNA Gyrase"},
    {"name": "Gentamicin", "class": "Aminoglycoside", "target": "Ribosome 30S"},
    {"name": "Polymyxin B", "class": "Polymyxin", "target": "Cell Membrane"}
]

def run_insilico_trials(genome_data: dict):
    """
    Simulates clinical trials.
    Input: The analysis results (resistance genes, CRISPR status).
    Output: A ranked list of effective treatments.
    """
    results = []
    
    # 1. Get Bacterial Defenses
    # Convert list of dicts [{'gene': 'blaKPC'}] to simple list ['blakpc']
    res_genes = [g['gene'].lower() for g in genome_data.get('resistance_genes', [])]
    has_crispr = genome_data.get('crispr_status') == 'Present'
    
    # --- TRIAL 1: PHAGES ---
    for phage in PHAGE_LIBRARY:
        score = phage['efficiency'] * 100
        notes = []
        
        # Simulation: CRISPR Defense
        if has_crispr:
            # Random chance CRISPR spacers match this phage
            if random.random() > 0.6: 
                score -= 40
                notes.append("CRISPR interference predicted")
        
        final_score = min(max(round(score, 1), 0), 99)
        
        results.append({
            "type": "Phage",
            "name": phage['name'],
            "target": phage['target'],
            "success_prob": final_score,
            "status": "Effective" if final_score > 75 else "Resistant",
            "notes": "; ".join(notes) if notes else "High compatibility"
        })

    # --- TRIAL 2: ANTIBIOTICS ---
    for drug in ANTIBIOTIC_LIBRARY:
        score = 90 # Base effectiveness
        notes = []
        is_resistant = False
        
        # Simulation: Resistance Gene Matching
        if "bla" in str(res_genes) and drug['class'] == "Carbapenem":
            score = 10
            notes.append("Enzymatic degradation (Beta-lactamase)")
            
        if ("aac" in str(res_genes) or "aph" in str(res_genes)) and drug['class'] == "Aminoglycoside":
            score = 25
            notes.append("Ribosomal protection detected")

        results.append({
            "type": "Antibiotic",
            "name": drug['name'],
            "target": drug['target'],
            "success_prob": score,
            "status": "Effective" if score > 80 else "Resistant",
            "notes": "; ".join(notes) if notes else "Standard susceptibility"
        })
        
    # Sort: Best treatments first
    results.sort(key=lambda x: x['success_prob'], reverse=True)
    return results