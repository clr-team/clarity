/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {OptionSelectionService} from "./option-selection.service";
import {ClrOption} from "../option";
import {IfOpenService} from "../../../utils/conditional/if-open.service";
import {ElementRef} from "@angular/core";
import {Subscription} from "rxjs";

export default function() {
    describe("Option Selection Service", () => {
        let optionSelectionService: OptionSelectionService;
        let fakeOption1: ClrOption;
        let fakeOption2: ClrOption;

        beforeEach(() => {
            optionSelectionService = new OptionSelectionService();
            fakeOption1 = new ClrOption(new IfOpenService(), new ElementRef(null), null, optionSelectionService);
            fakeOption2 = new ClrOption(new IfOpenService(), new ElementRef(null), null, optionSelectionService);
        });

        it("updates the selection with the selected option", () => {
            expect(optionSelectionService.currentSelection.length).toBe(0);

            optionSelectionService.updateSelection(fakeOption1);

            expect(optionSelectionService.currentSelection.length).toBe(1);
            expect(optionSelectionService.currentSelection[0]).toBe(fakeOption1);
        });

        it("replaces the current selection with the new selection", () => {
            optionSelectionService.updateSelection(fakeOption1);

            expect(optionSelectionService.currentSelection[0]).toBe(fakeOption1);

            optionSelectionService.updateSelection(fakeOption2);

            expect(optionSelectionService.currentSelection.length).toBe(1);
            expect(optionSelectionService.currentSelection[0]).toBe(fakeOption2);
        });

        it("updates the selected flag of the option when it is selected", () => {
            expect(fakeOption1.selected).toBe(false);
            expect(fakeOption2.selected).toBe(false);

            optionSelectionService.updateSelection(fakeOption1);

            expect(fakeOption1.selected).toBe(true);
            expect(fakeOption2.selected).toBe(false);

            optionSelectionService.updateSelection(fakeOption2);

            expect(fakeOption1.selected).toBe(false);
            expect(fakeOption2.selected).toBe(true);
        });

        it("provides an observable to subscribe to change in option selection", () => {
            expect(optionSelectionService.selectionChanged).toBeDefined();
        });

        it("notifies when a selection has been updated", () => {
            let count: number = 0;
            const sub: Subscription = optionSelectionService.selectionChanged.subscribe(() => {
                count++;
            });

            optionSelectionService.updateSelection(fakeOption1);

            expect(count).toBe(1);

            optionSelectionService.updateSelection(fakeOption2);

            expect(count).toBe(2);

            sub.unsubscribe();
        });

        it("does not notify when the selected option is selected again", () => {
            let count: number = 0;
            const sub: Subscription = optionSelectionService.selectionChanged.subscribe(() => {
                count++;
            });

            optionSelectionService.updateSelection(fakeOption1);

            expect(count).toBe(1);

            optionSelectionService.updateSelection(fakeOption1);

            expect(count).toBe(1);

            sub.unsubscribe();
        });
    });
}
