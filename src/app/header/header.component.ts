import { Component, OnInit,Inject } from '@angular/core';
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus, RedirectRequest, PopupRequest, InteractionType, AuthenticationResult } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { b2cPolicies } from 'src/app/auth-config';
import { UserProfile } from '../models/user-profile';
import { UserProfileService } from '../service/user-profile.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userProfile!: UserProfile;
  loginDisplay = false;
  displayedColumns: string[] = ['claim', 'value'];
  dataSource: any = [];
  isIframe = false;
  private readonly _destroying$ = new Subject<void>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private userProfileService: UserProfileService
  ) {
    const profile: UserProfile = {
      adObjectId: '',
      firstName: '',
      lastName: '',
      businessDescription: '',
      businessName: '',
      country: '',
      displayName: '',
      phoneNumber: '',
      email: [],
    };
    this.userProfile = profile;

  }

  // getClaims(claims: any) {
    
  //   this.userProfile.adObjectId = claims ? claims['oid'] : null;
  //   this.userProfile.businessDescription = claims
  //     ? claims['extension_BusinessDescription']
  //     : null;
  //   this.userProfile.businessName = claims
  //     ? claims['extension_BusinessName']
  //     : null;
  //   this.userProfile.country = claims ? claims['country'] : null;
  //   this.userProfile.displayName = claims ? claims['name'] : null;
  //   this.userProfile.email = claims ? claims['emails'][0] : '';
  //   this.userProfile.firstName = claims ? claims['given_name'] : null;
  //   this.userProfile.lastName = claims ? claims['extension_LastName'] : null;
  //   this.userProfile.phoneNumber = claims
  //     ? claims['extension_PhoneNumber']
  //     : null;

  //   this.dataSource = [
  //     { id: 1, claim: 'Display Name', value: claims ? claims['name'] : null },
  //     { id: 2, claim: 'Object ID', value: claims ? claims['oid'] : null },
  //     { id: 3, claim: 'Job Title', value: claims ? claims['jobTitle'] : null },
  //     { id: 4, claim: 'City', value: claims ? claims['city'] : null },
  //     {
  //       id: 5,
  //       claim: 'Business Description',
  //       value: claims ? claims['extension_BusinessDescription'] : null,
  //     },
  //     {
  //       id: 6,
  //       claim: 'Business Name',
  //       value: claims ? claims['extension_BusinessName'] : null,
  //     },
  //     {
  //       id: 7,
  //       claim: 'Phone Number',
  //       value: claims ? claims['extension_PhoneNumber'] : null,
  //     },
  //     {
  //       id: 8,
  //       claim: 'Given Name',
  //       value: claims ? claims['given_name'] : null,
  //     },
  //     {
  //       id: 9,
  //       claim: 'Last Name',
  //       value: claims ? claims['extension_LastName'] : null,
  //     },
  //     { id: 10, claim: 'Emails', value: claims ? claims['emails'] : null },
  //   ];
  //   // console.log(JSON.stringify(claims));
  //   // console.log(JSON.stringify(this.userProfile));
  //   this.saveUserProfile();
  // }

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;

    /**
     * You can subscribe to MSAL events as shown below. For more info,
     * visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/v2-docs/events.md
     */
    this.msalBroadcastService.inProgress$
    .pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      takeUntil(this._destroying$)
    )
    .subscribe(() => {
      this.setLoginDisplay();      
      // this.getClaims( 
      //   this.authService.instance.getActiveAccount()?.idTokenClaims
      // );
      this.saveUserProfile();
    });
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  login(userFlowRequest?: RedirectRequest | PopupRequest) {
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      if (this.msalGuardConfig.authRequest) {
        this.authService.loginPopup({...this.msalGuardConfig.authRequest, ...userFlowRequest} as PopupRequest)
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      } else {
        this.authService.loginPopup(userFlowRequest)
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      }
    } else {
      if (this.msalGuardConfig.authRequest){
        this.authService.loginRedirect({...this.msalGuardConfig.authRequest, ...userFlowRequest} as RedirectRequest);
      } else {
        this.authService.loginRedirect(userFlowRequest);
      }
    }
  }

  logout() {
    this.authService.logout();
  }

  editProfile() {
    let editProfileFlowRequest = {
      scopes: ["openid"],
      authority: b2cPolicies.authorities.editProfile.authority,
    };

    this.login(editProfileFlowRequest);
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  saveUserProfile() {
    this.userProfileService
      .saveUserProfile()
      .subscribe((res) => {
        this.getProfile();
      });
  }

  getProfile(){
    this.userProfileService.getUserProfile().subscribe(s=>{
      this.userProfile= s;
    });
  }

}
