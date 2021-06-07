import { Injectable } from "@angular/core";
import { NgxBootstrapConfirmService } from "ngx-bootstrap-confirm";
declare const $;
declare const swal;
@Injectable()
export class AlertService {
    constructor(
        private askComfirm: NgxBootstrapConfirmService,
    ) {

    }
    notify(message: string, type: string = 'warning') {

        $.notify({
            // options
            title: 'แจ้งเตือน',
            message: message,
        }, {
            // settings
            element: 'body',
            position: null,
            type: type,
            allow_dismiss: true,
            newest_on_top: false,
            showProgressbar: false,
            placement: {
                from: "top",
                align: "right"
            },
            offset: 20,
            spacing: 10,
            z_index: 1031,
            delay: 5000,
            timer: 1000,
            url_target: '_blank',
            mouse_over: null,
            animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
            },
            onShow: null,
            onShown: null,
            onClose: null,
            onClosed: null,
            icon_type: 'class',
            template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
                '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                '<span data-notify="icon"></span> ' +
                '<span data-notify="title">{1}</span> ' +
                '<span data-notify="message">{2}</span>' +
                '<div class="progress" data-notify="progressbar">' +
                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                '</div>' +
                '<a href="{3}" target="{4}" data-notify="url"></a>' +
                '</div>'
        });
    }

    some_err_humen() {
        this.notify('เกิดความผิดพลาดบางอย่าง กรุณากรอกข้อมูลอีกครั้ง');
    }

    askConfirm(message: string = 'คุณต้องการจะทำรายการต่อไปหรือไม่?'): Promise<any> {
        return swal(message, {
            buttons: ["ยกเลิก", "ยืนยัน"],
            dangerMode: true
        });
    }


    askConfirm_v2() {
        let options = {
            title: 'คุณต้องการดำเนินรายการต่อหรือไม่?',
            confirmLabel: 'ตกลง',
            declineLabel: 'ยกเลิก',
        }
        return this.askComfirm.confirm(options)
    }

}