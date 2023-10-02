import { CrossTreeSelector } from "axe-core";

export interface Issue {
    code: string;
    severity: string;
    message: string;
    element: string;
    selector: CrossTreeSelector;
    device: string;
    runner: string;
    technique_id: string;
}