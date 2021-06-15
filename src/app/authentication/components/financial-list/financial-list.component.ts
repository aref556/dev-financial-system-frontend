import { ChangeDetectorRef, Component, TemplateRef } from '@angular/core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { InRoleDocument, InDocument, FinancialDocumentService, InFlagStatus } from 'src/app/authentication/services/financial-document.service';
import { AuthenService } from 'src/app/services/authen.service';
import { AccountService, InAccount, InRoleAccount } from 'src/app/shareds/services/account.service';
import { AlertService } from 'src/app/shareds/services/alert.service';
import { PdfService } from 'src/app/shareds/services/pdf.service';
import { InDelivery } from '../../financial-document/components/delivery/delivery.interface';
import { InInvoiceDocument } from '../../financial-document/components/invoice-document/invoice-document.interface';
import { InInvoice } from '../../financial-document/components/invoice/invoice.interface';
import { InMessageMemos } from '../../financial-document/components/message-memos/message-memos.interface';
import { InDocumentList, InDocumentSearch, InDocumentSearchKey, InFinancialListComponent } from './financial-list.interface';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
@Component({
  selector: 'app-financial-list',
  templateUrl: './financial-list.component.html',
  styleUrls: ['./financial-list.component.scss']
})
export class FinancialListComponent implements InFinancialListComponent {

  constructor(
    private document: FinancialDocumentService,
    private alert: AlertService,
    private detect: ChangeDetectorRef,
    private account: AccountService,
    private authen: AuthenService,
    private localeService: BsLocaleService,
    private pdf: PdfService,
    private modalService: BsModalService,


  ) {
    // เปลี่ยน Dateoicker เป็นภาษาไทย
    this.localeService.use('th');
    // โหลดข้อมูลเอกสาร
    this.initialLoadDocuments({
      startPage: this.startPage,
      limitPage: this.limitPage,
    });
    //กำหนดต่าเริ่มต้นให้กับ searchType
    this.searchType = this.searchTypeItems[0];
    // โหลด user login
    this.initialLoadUserLogin();


  }

  convertType(type: string) {
    try {
      if (type == this.states[0])
        this.searchText = '1';
      if (type == this.states[1])
        this.searchText = '2';
      if (type == this.states[2])
        this.searchText = '3';
      if (type == this.states[3])
        this.searchText = '4';

      if (type == this.status[0])
        this.searchText = '1';
      if (type == this.status[1])
        this.searchText = '2';
    } catch (err) {
      this.alert.notify(`convertType: ` + err.Message);
    }

  }

  stateCtrl = new FormControl();

  myForm = new FormGroup({
    state: this.stateCtrl
  });

  states = [
    `ใบแจ้งหนี้`,
    `เอกสารใบแจ้งหนี้`,
    `ใบส่งของ`,
    `บันทึกข้อความ`,
  ];

  statusCtrl = new FormControl();
  statusForm = new FormGroup({
    status: this.statusCtrl
  });

  status = ['กำลังดำเนินการ', 'ดำเนินการเสร็จสิ้น']

  modalRef: BsModalRef<any>;


  items: InDocumentList;
  // ตัวแปรสำหรับค้นหา
  searchText: string = '';
  searchType: InDocumentSearchKey;
  searchTypeItems: InDocumentSearchKey[] = [
    { key: 'type', value: 'ค้นหาจากประเภทของเอกสาร' },
    { key: 'id_doc', value: 'ค้นหาจากหมายเลขเอกสาร' },
    { key: 'date', value: 'ค้นหาจากวันที่ในเอกสาร' },
    { key: 'updated', value: 'ค้นหาจากวันที่สร้างเอกสาร' },
    { key: 'status', value: 'ค้นหาจากสถานะการดำเนินการ' },
    { key: 'beetween', value: 'ค้นหาแบบช่วงวันที่' },
  ];
  // ตัวแปร pagination
  startPage: number = 1;
  limitPage: number = 20;

  //ตรวจสอบสิทธ์ผู้ใช้งาน
  UserLogin: InAccount;
  Role: typeof InRoleAccount;

  //เปลี่ยนหน้า pagination
  onPageChanged(page: PageChangedEvent) {
    try {
      this.initialLoadDocuments({
        searchText: this.getSearchText,
        searchType: this.searchType.key,
        startPage: page.page,
        limitPage: page.itemsPerPage
      });

    } catch (err) {
      this.alert.notify('function onPageChanged: ' + err.Message);
      console.log('function onPageChanged: ' + err.Message);
    }

  }

  // ค้นหาข้อมูล
  onSearchItem(): void {
    // try {
    this.startPage = 1;
    this.initialLoadDocuments({
      searchText: this.getSearchText,
      searchType: this.searchType.key,
      startPage: this.startPage,
      limitPage: this.limitPage
    });
    //กระตุ้น Event
    this.detect.detectChanges();
    // } catch (err) {
    //   this.alert.notify(`function onSearchItem: ` + err.Message);
    //   console.log(`function onSearchItem: ` + err.Message);
    // }

  }

  //แสดงชื่อสิทธิ์ผู้ใช้งาน
  getTypeName(role: InRoleDocument) {
    try {
      if (InRoleDocument[role] == InRoleDocument[1])
        return 'ใบแจ้งหนี้';
      else if (InRoleDocument[role] == InRoleDocument[2])
        return 'เอกสารใบแจ้งหนี้';
      else if (InRoleDocument[role] == InRoleDocument[3])
        return 'ใบส่งของ';
      else if (InRoleDocument[role] == InRoleDocument[4])
        return 'บันทึกข้อความ';
      else
        return InRoleDocument[role];
    } catch (err) {
      this.alert.notify(`function getTypeName: ` + err.Message);
      console.log(`function getTypeName: ` + err.Message);
    }

  }

  getFlagStatus(role: InFlagStatus) {
    try {
      if (InFlagStatus[role] == InFlagStatus[1])
        return 'กำลังดำเนินการ';
      else if (InFlagStatus[role] == InFlagStatus[2])
        return 'ดำเนินการเสร็จสิ้น';
      else
        return InFlagStatus[role];

    } catch (err) {
      this.alert.notify(`function getFlagName: ` + err.Message);
      console.log(`function getFlagname: ` + err.Message);
    }

  }

  onDeleteDocument(item: InDocument): void {
    this.alert.askConfirm_v2().then(res => {
      if (res) {
        this.document
          .deleteDocument(item.id)
          .then(() => {
            //โหลดข้อมูลเอกสารใหม่
            this.initialLoadDocuments({
              searchText: this.getSearchText,
              searchType: this.searchType.key,
              startPage: this.startPage,
              limitPage: this.limitPage
            });
            this.alert.notify('ลบข่อมูลสำเร็จ', 'info');
          })
          .catch(err => this.alert.notify(err.Message));
      }
      else
        return;
    });
  }

  async onLookDocument(item: InDocument) {
    // try {
    const doc = await this.document.getDocumentById(item.id);
    const doc_string = JSON.stringify(doc);
    const doc_object = JSON.parse(doc_string);
    if (doc.type == 1) {
      await this.pdf.generateInvoice(doc_object as InInvoice);
    }
    if (doc.type == 2) {
      await this.pdf.generateInvoiceDocs(doc_object as InInvoiceDocument);
    }
    if (doc.type == 3) {
      await this.pdf.generateDelivery(doc_object as InDelivery);
    }
    if (doc.type == 4) {
      await this.pdf.generateMessageMemos(doc_object as InMessageMemos);
    }
    // } catch (error) {
    //   this.alert.notify(error.Message);
    // }
  }

  openModal(template: TemplateRef<any>, item: InDocument) {
    // try {
    localStorage.setItem('id_select', item.id);
    this.modalRef = this.modalService.show(template);


    // } catch (err) {
    //   this.alert.notify(`function openModal : ` + err.Message);
    //   console.log(`function openModal : ` + err.Message);
    // }

  }

  private get getSearchText() {
    // try {
    let responseSearchText = null;
    switch (this.searchType.key) {
      case 'type':
        // console.log(this.myForm.value.state);
        this.convertType(this.myForm.value.state);
        responseSearchText = this.searchText;
        break;
      case 'status':
        this.convertType(this.statusForm.value.status);
        responseSearchText = this.searchText;
        break;
      case 'beetween':
        const searchDate: { from: Date, to: Date } = { from: this.searchText[0], to: this.searchText[1] } as any;
        searchDate.from.setHours(0);
        searchDate.from.setMinutes(0);
        searchDate.from.setSeconds(0);
        searchDate.to.setHours(23);
        searchDate.to.setMinutes(59);
        searchDate.to.setSeconds(59);
        responseSearchText = searchDate;
        break;
      default:
        responseSearchText = this.searchText;
        break;
    }
    return responseSearchText;

    // } catch (err) {
    //   this.alert.notify(`getSearch: ` + err.Message);
    // }

  }

  // โหลดข้อมูลเอกสาร
  initialLoadDocuments(options?: InDocumentSearch) {
    this.document
      .getDocuments(options)
      .then(items => {
        this.items = items;
        // console.log(this.items);
      })
      .catch(err => this.alert.notify(err.Message));
  }

  // โหลดข้อมูลผู้ใช้ที่ยัง Login
  private initialLoadUserLogin() {
    this.UserLogin = this.account.userLogin;
    this.account
      .getUserLogin(this.authen.getAuthenticated())
      .then(userLogin => this.UserLogin = userLogin)
      .catch(err => this.alert.notify(err.Message));
  }

}
