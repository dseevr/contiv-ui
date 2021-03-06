import {Component, Inject, OnInit, ViewEncapsulation} from "@angular/core";
import {CRUDHelperService} from "../components/utils/crudhelperservice";
import {Router, ActivatedRoute} from "@angular/router";
import {AuthService} from "../components/utils/authservice";
import { ContivGlobals } from "../components/models/contivglobals";
import {ChartService} from "../components/utils/chartservice";
declare var jQuery:any;

@Component({
    selector: 'login',
    templateUrl: './login.html',
    styles: [require('./login.css')]
})

export class LoginComponent implements OnInit{
    public showLoader: boolean;
    public showServerError: boolean;
    public serverErrorMessage: string;
    private crudHelperService: CRUDHelperService;
    public loginCtrl: any;
    public username: string;
    public password: string;
    public product_name:string = ContivGlobals.PRODUCT_NAME;
    
    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                crudHelperService: CRUDHelperService,
                private authService: AuthService,
                private chartService: ChartService){
        this.showLoader = true;
        this.showServerError = false;
        this.crudHelperService = crudHelperService;
        this.username = '';
        this.password = '';
        this.loginCtrl = this;
    }

    ngOnInit(){
        this.crudHelperService.stopLoader(this);
        jQuery("body").addClass("loginbackground");
    }

    ngOnDestroy(){
        jQuery("body").removeClass("loginbackground");
    }

    login(){
        this.crudHelperService.startLoader(this);
        this.authService.login({username: this.username, password: this.password})
            .subscribe((result) => {
                if(result){
                    this.showServerError = false;
                    this.crudHelperService.stopLoader(this);
                    this.chartService.startpolling();
                    if(this.authService.firstRun){
                        this.router.navigate(['/m/firstrun']);
                    }
                    else{
                        if (this.authService.redirectUrl.length > 0) {
                            var redirectUrl = this.authService.redirectUrl;
                            this.authService.redirectUrl = '';
                            this.router.navigate([redirectUrl]);
                        }
                        else{
                            this.router.navigate(['/m/dashboard']);
                        }
                    }
                }
                else{
                    this.crudHelperService.stopLoader(this);
                    this.showServerError = true;
                    jQuery('#login-failed').modal('show');
                }
            }, (error) => {
                this.crudHelperService.stopLoader(this);
                this.showServerError = true;
            });
    }
}