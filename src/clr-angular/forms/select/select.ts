/**
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
    AfterContentInit,
    Component,
    ContentChild,
    ElementRef,
    HostListener,
    PLATFORM_ID,
    Renderer2,
    ViewChild
} from "@angular/core";

import {POPOVER_HOST_ANCHOR} from "../../popover/common/popover-host-anchor.token";
import {IfOpenService} from "../../utils/conditional/if-open.service";
import {TAB} from "../../utils/key-codes/key-codes";
import {ClrOptions} from "./options";
import {OptionSelectionService} from "./providers/option-selection.service";
import {isPlatformBrowser} from "@angular/common";
import {SelectNoopDomAdapter} from "./utils/select-noop-dom-adapter";
import {SelectDomAdapter} from "./utils/select-dom-adapter";

// Fixes build error
// @dynamic (https://github.com/angular/angular/issues/19698#issuecomment-338340211)
export const selectDomAdapterFactory = (platformId: Object) => {
    if (isPlatformBrowser(platformId)) {
        return new SelectDomAdapter();
    } else {
        return new SelectNoopDomAdapter();
    }
};

@Component({
    selector: "clr-select",
    templateUrl: "select.html",
    providers: [
        IfOpenService,
        {provide: POPOVER_HOST_ANCHOR, useExisting: ElementRef},
        OptionSelectionService,
        {provide: SelectDomAdapter, useFactory: selectDomAdapterFactory, deps: [PLATFORM_ID]}
    ],
    host: {"[class.clr-select]": "true"}
})
export class ClrSelect implements AfterContentInit {
    @ViewChild("input") input: ElementRef;
    @ContentChild(ClrOptions) options: ClrOptions;

    constructor(
        private ifOpenService: IfOpenService,
        private optionSelectionService: OptionSelectionService,
        private renderer: Renderer2,
        private domAdapter: SelectDomAdapter) {
        this.initializeSubscriptions();
    }

    private initializeSubscriptions(): void {
        this.optionSelectionService.selectionChanged.subscribe(() => {
            this.renderSelection();
        });
    }

    private renderSelection(): void {
        if (this.input) {
            this.optionSelectionService.currentSelection.forEach(option => {
                this.domAdapter.clearChildren(this.input.nativeElement);
                const clone: HTMLElement = this.domAdapter.cloneNode(option.elRef.nativeElement);
                this.renderer.setAttribute(clone, "contenteditable", "false");
                this.renderer.appendChild(this.input.nativeElement, clone);
            });
        }
    }

    private registerPopoverIgnoredInput() {
        if (this.input) {
            this.ifOpenService.registerIgnoredElement(this.input);
        }
    }

    toggleOptionsMenu(event: MouseEvent): void {
        this.ifOpenService.toggleWithEvent(event);
    }

    @HostListener("click")
    focusInput() {
        if (this.input) {
            this.domAdapter.focus(this.input.nativeElement);
        }
    }

    closeMenuOnTabPress(event: KeyboardEvent) {
        if (event && event.keyCode === TAB) {
            this.ifOpenService.open = false;
        }
    }

    // Lifecycle methods
    ngAfterContentInit() {
        this.registerPopoverIgnoredInput();
    }
}
