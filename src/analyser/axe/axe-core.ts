// leave this object here in case I want to add wcag technique ids to the axe results later
export const axeCodes: { [key: string]: { code: string, techniqueId?: string[] }} = {
    "area-alt": { "code": "1.1.1", "techniqueId": ["H24"] },
    "aria-allowed-attr": { "code": "4.1.2" },
    "aria-dpub-role-fallback": { "code": "1.3.1" },
    "aria-hidden-body": { "code": "4.1.2" },
    "aria-hidden-focus": { "code": "4.1.2" },
    "aria-input-field-name": { "code": "4.1.2" },
    "aria-meter-name": { "code": "1.1.1" },
    "aria-progressbar-name": { "code": "1.1.1" }, 
    "aria-required-attr": { "code": "4.1.2" },
    "aria-required-children": { "code": "1.3.1" },
    "aria-required-parent": { "code": "1.3.1" },
    "aria-roles": { "code": "4.1.2" },
    "aria-toggle-field-name": { "code": "4.1.2" },
    "aria-tooltip-name": { "code": "4.1.2" },
    "aria-valid-attr-value": { "code": "4.1.2" },
    "aria-valid-attr": { "code": "4.1.2" },
    "audio-caption": { "code": "1.2.1" },
    "autocomplete-valid": { "code": "1.3.5" },
    "avoid-inline-spacing": { "code": "1.4.1" },
    "blink": { "code": "2.2.2", "techniqueId": ["F47"] },
    "button-name": { "code": "4.1.2" },
    "bypass": { "code": "2.4.1", "techniqueId": ["G1", "ARIA11", "H69"] },
    "color-contrast": { "code": "1.4.3", "techniqueId": ["G18"] },
    "css-orientation-lock": { "code": "1.3.4" },
    "definition-list": { "code": "1.3.1", "techniqueId": ["H40", "H48"] },
    "dlitem": { "code": "1.3.1", "techniqueId": ["H40", "H48"] },
    "document-title": { "code": "2.4.2", "techniqueId": ["H25"] },
    "duplicate-id-active": { "code": "4.1.1" },
    "duplicate-id-aria": { "code": "4.1.1", "techniqueId": ["F77"] },
    "duplicate-id": { "code": "4.1.1" },
    "form-field-multiple-labels": { "code": "3.3.2", "techniqueId": ["F68", "H44", "ARIA16", "ARIA14", "H65"] },
    "frame-focusable-content": { "code": "2.1.1" },
    "frame-title": { "code": "2.4.1", "techniqueId": ["H64"] },
    "frame-title-unique": { "code": "4.1.2", "techniqueId": ["H64"] },
    "html-has-lang": { "code": "3.1.1", "techniqueId": ["H57"] },
    "html-lang-valid": { "code": "3.1.1", "techniqueId": ["H57"] },
    "html-xml-lang-mismatch": { "code": "3.1.1", "techniqueId": ["H57"] },
    "identical-links-same-purpose": { "code": "2.4.9" },
    "image-alt": { "code": "1.1.1", "techniqueId": ["F65", "H37", "H67", "ARIA10"] },
    "input-button-name": { "code": "4.1.2" },
    "input-image-alt": { "code": "1.1.1", "techniqueId": ["F65", "H36"] },
    "label-content-name-mismatch": { "code": "2.5.3" },
    "landmark-one-main": { "code": "1.2.0", "techniqueId": ["ARIA11"] },
    "label": { "code": "4.1.2", "techniqueId": ["F68", "H44", "ARIA16", "ARIA14", "H65"] },
    "layout-table": { "code": "1.3.1" },
    "link-in-text-block": { "code": "1.4.1", "techniqueId": ["G18"] },
    "link-name": { "code": "4.1.2", "techniqueId": ["ARIA7", "F89", "G91", "H30"] },
    "list": { "code": "1.3.1", "techniqueId": ["H48"] },
    "listitem": { "code": "1.3.1", "techniqueId": ["H48"] },
    "marquee": { "code": "2.2.2", "techniqueId": ["F16"] },
    "meta-refresh": { "code": "2.2.1", "techniqueId": ["H76", "F41"] },
    "meta-viewport": { "code": "1.4.4" },
    "nested-interactive": { "code": "4.1.2" },
    "no-autoplay-audio": { "code": "4.1.2" },
    "object-alt": { "code": "1.1.1", "techniqueId": ["H53"] },
    "p-as-heading": { "code": "1.3.1" },
    "role-img-alt": { "code": "1.1.1", "techniqueId": ["F65", "H37", "H67", "ARIA10"] },
    "scrollable-region-focusable": { "code": "2.1.1", "techniqueId": ["F55"] },
    "select-name": { "code": "4.1.2" },
    "server-side-image-map": { "code": "2.1.1" },
    "svg-img-alt": { "code": "1.1.1", "techniqueId": ["G94"] },
    "table-fake-caption": { "code": "1.3.1" },
    "target-size": { "code": "2.5.8" },
    "td-has-header": { "code": "1.3.1" },
    "td-headers-attr": { "code": "1.3.1", "techniqueId": ["H43", "H53", "H63", "H73"] },
    "th-has-data-cells": { "code": "1.3.1", "techniqueId": ["H43", "H51", "H63", "H73"] },
    "valid-lang": { "code": "3.1.2", "techniqueId": ["H58"] },
    "video-caption": { "code": "1.2.2", "techniqueId": ["G87", "G93"] },
    "video-description": { "code": "1.2.5" },
}