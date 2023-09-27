export interface Issue {
    code: string;
    severity: string;
    message: string;
    element: string;
    selector: string | ShadowDomSelector;
    device: string;
    runner: string;
    technique_id: string;
}