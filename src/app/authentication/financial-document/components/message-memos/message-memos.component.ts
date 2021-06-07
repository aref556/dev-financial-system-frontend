import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinancialDocumentService } from 'src/app/authentication/services/financial-document.service';
import { AlertService } from 'src/app/shareds/services/alert.service';
import { PdfService } from 'src/app/shareds/services/pdf.service';
import { InInvoiceDocument } from '../invoice-document/invoice-document.interface';
import { ForwarderSelect, TypeIncome } from '../invoice/invoice.interface';
import { InMessageMemosComponent } from './message-memos.interface';

@Component({
  selector: 'app-message-memos',
  templateUrl: './message-memos.component.html',
  styleUrls: ['./message-memos.component.css']
})
export class MessageMemosComponent implements InMessageMemosComponent {

  constructor(
    private pdf: PdfService,
    private alert: AlertService,
    private builder: FormBuilder,
    private service: FinancialDocumentService,
  ) {
    this.initialCreateFormData();
  }

  type_income_select: TypeIncome = { id: 0, type: 'ไม่เลือกประเภทของรายได้' };
  type_income: TypeIncome[] = [
    { id: 1, type: 'ค่าตรวจและวิเคราะห์ข้อสอบ' },
    { id: 2, type: 'ค่ากระดาษคำตอบ' },
    { id: 3, type: 'ค่าเชื่อมต่อระบบเครือข่ายคอมพิวเตอร์' },
    { id: 4, type: 'ค่าเช่าเครื่องคอมพิวเตอร์' },
    { id: 5, type: 'ค่าเช่า Core Fiber ' },
    { id: 6, type: 'ค่าเช่าคู่สายทองแดง' },
    { id: 7, type: 'PSU Passport' },
    { id: 8, type: 'ค่าบำรุงรักษาโทรศัพท์' },
    { id: 9, type: 'ค่าจัดสอบวัดความรู้ทางคอมพิวเตอร์' },
    { id: 10, type: 'รายได้อื่นๆ' },
    { id: 11, type: 'ค่าพิมพ์สี' },
    { id: 12, type: 'ค่าพิมพ์วุฒิบัตร' },
    { id: 13, type: 'ค่าเช่าเครื่องคอมพิวเตอร์แม่ข่าย' },
    { id: 14, type: 'ค่าเช่าอุปกรณ์รับส่งสัญญาณอินเตอร์เน็ต' },
    { id: 15, type: 'ค่าซอฟต์แวร์ลิขสิทธิ์งานโทรศัพท์' },
    { id: 16, type: 'รายได้ค่าแท่นติดตั้งอุปกรณ์' },
    { id: 17, type: 'ค่าบริการฝึกอบรม' },
    { id: 18, type: 'รายได้ค่าแท่นติดตั้งอุปกรณ์' },
    { id: 19, type: 'ค่าลงทะเบียนประชุม อบรม สัมมนา' },
    { id: 20, type: 'ค่าบริการฝึกอบรม' },
    { id: 21, type: 'ค่าให้บริการห้องคอมพิวเตอร์พร้อมอุปกรณ์' },
    { id: 22, type: 'ค่าอาหารว่างและเครื่องดื่ม' },
    { id: 23, type: 'ค่าอาหารกลางวัน' },
    { id: 24, type: 'ค่าตอบแทนการปฏิบัติงานนอกเวลาราชการ' },
    { id: 25, type: 'ค่าใช้จ่ายเช่าห้องอื่นๆ' },
    { id: 26, type: 'ค่าบริการวิชาการ' },
    { id: 27, type: 'IT Service' },
    { id: 28, type: 'ค่า Video Conference' },
    { id: 29, type: 'ค่าบริการอินเตอร์เน็ต' },
    { id: 30, type: 'เงินรับฝากค่าโทรศัพท์' },
    { id: 31, type: 'เงินรับฝาก-ค่าบริการอินเทอร์เน็ตล่วงหน้า' },
    { id: 32, type: 'เงินรับฝาก-ค่ามัดจำอุปกรณ์บริการอินเทอร์เน็ต' },

  ];

  onSelectType(select: TypeIncome): void {
    this.type_income_select = select;
  }

  form: FormGroup;
  doc: InInvoiceDocument;
  forwarder_select: ForwarderSelect = { id: 2, name: 'นางเนาวรัตน์ สอิด', job_position: 'หัวหน้าฝ่ายบริหารจัดการ สำนักนวัตกรรมดิจิตอลและระบบอัจฉริยะ' };
  forwarders: ForwarderSelect[] = [
    { id: 0, name: 'รศ.ดร. สินชัย กมลภิวงศ์', job_position: 'รักษาการแทนผู้อำนวยการ สำนักนวัตกรรมดิจิตอลและระบบอัจฉริยะ' },
    { id: 1, name: 'ดร. ชิดชนก โชคสุชาติ', job_position: 'รักษาการแทนรองผู้อำนวยการ สำนักนวัตกรรมดิจิตอลและระบบอัจฉริยะ' },
    { id: 2, name: 'นางเนาวรัตน์ สอิด', job_position: 'หัวหน้าฝ่ายบริหารจัดการ สำนักนวัตกรรมดิจิตอลและระบบอัจฉริยะ' },
  ];

  onSubmit(): void {
    if (this.form.invalid) return this.alert.some_err_humen();
    this.doc = this.form.value;
    this.doc.type = 4;
    this.doc.guarantor = this.forwarder_select.name;
    this.doc.guarantor_position = this.forwarder_select.job_position;
    this.doc.type_income = this.type_income_select.type;
    // console.log(this.doc);
    this.pdf.generateMessageMemos(this.doc)
      .then(res => {
        if (res) {
          this.service.onCreateMessageMemos(this.doc);
        }
      })
      .catch(err => {
        this.alert.notify(err.Message);
      })

  }

  // สร้างฟอร์ม
  private initialCreateFormData() {
    this.form = this.builder.group({
      id_doc: ['', Validators.required],
      date: ['', Validators.required],
      title: ['', Validators.required],
      title_to: ['', Validators.required],
      message: ['', Validators.required],
    });
  }



}
