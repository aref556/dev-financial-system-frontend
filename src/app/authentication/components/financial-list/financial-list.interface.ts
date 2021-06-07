import { TemplateRef } from "@angular/core";
import { NumberValueAccessor } from "@angular/forms";
import { BsModalRef } from "ngx-bootstrap/modal";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { InDocument, InFlagStatus, InRoleDocument } from "src/app/authentication/services/financial-document.service";
import { InAccount, InRoleAccount } from "src/app/shareds/services/account.service";
import { InDelivery } from "../../financial-document/components/delivery/delivery.interface";
import { InInvoiceDocument } from "../../financial-document/components/invoice-document/invoice-document.interface";
import { InInvoice } from "../../financial-document/components/invoice/invoice.interface";
import { InMessageMemos } from "../../financial-document/components/message-memos/message-memos.interface";

export interface InFinancialListComponent {
    items: InDocumentList;

    //ส่วนของการค้นหา
    searchText: string;
    searchType: InDocumentSearchKey;
    searchTypeItems: InDocumentSearchKey[];
    onSearchItem(): void;

    //ส่วนของ pagination
    startPage: number;
    limitPage: number;
    onPageChanged(page: PageChangedEvent);

    getTypeName(role: InRoleDocument): void;
    getFlagStatus(role: InFlagStatus): void;
    onDeleteDocument(item: InDocument): void;
    onLookDocument(item: InDocument);
    convertType(type: string);
    // onSuccessStatus(item: InDocument);

    UserLogin: InAccount;
    Role: typeof InRoleAccount;

    modalRef: BsModalRef;
    openModal(template: TemplateRef<any>, item:InDocument);

}

export interface InDocumentList {
    items: InDocument[];
    totalItems: number;
}

export interface InDocumentSearch {
    searchText?: string;
    searchType?: string;

    startPage: number;
    limitPage: number;
}

export interface InDocumentSearchKey {
    key: string;
    value: string;
}

export interface InTypeDocSearch {
    id: number;
    type: string;
}