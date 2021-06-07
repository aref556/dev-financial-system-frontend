import { FormGroup } from "@angular/forms";
import { BsModalRef } from "ngx-bootstrap/modal";
import { InDocument } from "src/app/authentication/services/financial-document.service";

export interface InSuccessProcessComponent{
    modalRef: BsModalRef;
    form: FormGroup;

    onSubmit(item: InDocument);
}


export interface InSuccessProcess{
    success_time: string;
    success_id_doc: string;
    note: string;
}