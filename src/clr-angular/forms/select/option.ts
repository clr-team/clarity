/**
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {Component, ElementRef, HostBinding, HostListener, Inject, Optional} from "@angular/core";
import {POPOVER_HOST_ANCHOR} from "../../popover/common/popover-host-anchor.token";
import {IfOpenService} from "../../utils/conditional/if-open.service";
import {OptionSelectionService} from "./providers/option-selection.service";

@Component({selector: "clr-option", templateUrl: "option.html", host: {"[class.clr-option]": "true"}})
export class ClrOption {
    private _selected: boolean = false;

    @HostBinding("class.active")
    get selected(): boolean {
        return this._selected;
    }

    set selected(value: boolean) {
        this._selected = value;
    }

    constructor(
        private ifOpenService: IfOpenService,
        @Optional() @Inject(POPOVER_HOST_ANCHOR) parentHost: ElementRef,
        public elRef: ElementRef,
        private optionSelectionService: OptionSelectionService) {
        if (!parentHost) {
            throw new Error("clr-option should only be used inside of a clr-select");
        }
    }

    /**
     * This behavior is only for single select. Multi select will keep the menu open on option click.
     * We will handle that later.
     */
    @HostListener("click")
    updateSelectionAndCloseMenu() {
        this.optionSelectionService.updateSelection(this);
        this.ifOpenService.open = false;
    }
}
