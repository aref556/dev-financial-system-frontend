import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AppURL } from 'src/app/app.url';
import { AuthURL } from 'src/app/authentication/authentication.url';
import { FinancialDocumentService} from 'src/app/authentication/services/financial-document.service';
import { AlertService } from 'src/app/shareds/services/alert.service';
import { InSuccessProcessComponent } from './success-process.interface';

@Component({
  selector: 'app-success-process',
  templateUrl: './success-process.component.html',
  styleUrls: ['./success-process.component.css']
})
export class SuccessProcessComponent implements InSuccessProcessComponent {

  constructor(
    private builder: FormBuilder,
    private alert: AlertService,
    private document: FinancialDocumentService,
    private router: Router,
  ) {
    this.initialCreateFormData();
  }
  @Input('modalRef') modalRef: BsModalRef<any>;
  form: FormGroup;

  onSubmit() {
    if (this.form.invalid)
      return this.alert.some_err_humen();
    // console.log(this.form.value);
    // console.log(`api to accept documents`);
    let id = localStorage.getItem('id_select');
    // console.log(id);
    this.document.updateFlagStatus(id, this.form.value)
      .then(status => {
        // console.log(status);
        this.modalRef.hide();
        this.alert.notify(`ดำเนินการเสร็จสิ้น`, 'info');
        localStorage.removeItem('id_select');
        window.location.reload();
        // this.router.navigate(['/', AppURL.Authen , AuthURL.Financials]);
      })
      .catch(err => {
        this.alert.notify(err.Message);
      })


  }

  private initialCreateFormData() {
    this.form = this.builder.group({
      success_time: ['', Validators.required],
      success_id_doc: ['', Validators.required],
      note: [''],
    })
  }




}


