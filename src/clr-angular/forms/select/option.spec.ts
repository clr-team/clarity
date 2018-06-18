/**
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {Component, ElementRef} from "@angular/core";
import {TestBed} from "@angular/core/testing";

import {TestContext} from "../../data/datagrid/helpers.spec";
import {POPOVER_HOST_ANCHOR} from "../../popover/common/popover-host-anchor.token";
import {IfOpenService} from "../../utils/conditional/if-open.service";

import {ClrOption} from "./option";
import {OptionSelectionService} from "./providers/option-selection.service";

@Component({
    template: `
        <clr-option>
            Test
        </clr-option>
    `,
    providers: [IfOpenService, {provide: POPOVER_HOST_ANCHOR, useExisting: ElementRef}, OptionSelectionService]
})
class TestComponent {
}

@Component({
    template: `
        <clr-option>
            Test
        </clr-option>
    `,
    providers: [IfOpenService, OptionSelectionService]
})
class TestComponentWithError {
}

export default function(): void {
    describe("Select Option Component", function() {
        let context: TestContext<ClrOption, TestComponent>;
        let ifOpenService: IfOpenService;
        let optionSelectionService: OptionSelectionService;

        describe("View Basics", function() {
            beforeEach(function() {
                context = this.create(ClrOption, TestComponent, []);
                ifOpenService = context.getClarityProvider(IfOpenService);
            });

            it("projects content", () => {
                expect(context.clarityElement.textContent.trim()).toMatch("Test");
            });

            it("closes the menu when an option is clicked", () => {
                const option = context.clarityElement;
                spyOn(context.clarityDirective, "updateSelectionAndCloseMenu");

                option.click();

                expect(context.clarityDirective.updateSelectionAndCloseMenu).toHaveBeenCalled();
            });

            it("adds the active class on the option when it is clicked", () => {
                let option: HTMLElement = context.clarityElement;
                expect(option.classList.contains("active")).toBe(false);

                option.click();
                context.detectChanges();

                option = context.clarityElement;
                expect(option.classList.contains("active")).toBe(true);
            });
        });

        describe("Typescript API", function() {
            beforeEach(function() {
                context = this.create(ClrOption, TestComponent, []);
                ifOpenService = context.getClarityProvider(IfOpenService);
                optionSelectionService = context.getClarityProvider(OptionSelectionService);
            });

            it("closes the menu when an item is clicked", () => {
                ifOpenService.open = true;

                context.clarityDirective.updateSelectionAndCloseMenu();

                expect(ifOpenService.open).toBe(false);
            });

            it("calls to update the selection when an item is clicked", () => {
                spyOn(optionSelectionService, "updateSelection");

                context.clarityDirective.updateSelectionAndCloseMenu();

                expect(optionSelectionService.updateSelection).toHaveBeenCalled();
            });

            it("provides a ref to the ElementRef of the option", () => {
                expect(context.clarityDirective.elRef).toBeDefined();
            });
        });

        describe("Error Condition", function() {
            it("throws an error when option is not used inside of clr-select", function() {
                TestBed.configureTestingModule({declarations: [ClrOption, TestComponentWithError]});
                expect(() => {
                    TestBed.createComponent(TestComponentWithError);
                }).toThrowError("clr-option should only be used inside of a clr-select");
            });
        });
    });
}
