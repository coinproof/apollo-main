import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import Web3 from "web3";
import { PriceapiService } from '../services/priceapi.service';
declare var global: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  smartContractAddress: string = environment.smartContractAddress;
  smartContractLink: string = environment.smartContractLink;
  contract:any;
  planetImage = '../../assets/images/Globe_WalletNotConnected.png'
  left1_activated = '../../assets/images/left1_activated.png';
  left1_notActivated = '../../assets/images/left1_notactivated.png';
  left2_activated = '../../assets/images/left2_activated.png';
  left2_notActivated = '../../assets/images/left2_notactivated.png';
  left3_activated = '../../assets/images/left3_activated.png';
  left3_notActivated = '../../assets/images/left3_notactivated.png';
  right1_activated = '../../assets/images/right1_activated.png';
  right1_notactivated = '../../assets/images/right1_notactivated.png';
  right2_activated = '../../assets/images/right2_activated.png';
  right2_notactivated = '../../assets/images/right2_notactivated.png';
  right3_activated = '../../assets/images/right3_activated.png';
  right3_notactivated = '../../assets/images/right3_notactivated.png';


  statisticLabel:string = '';
  isButton = '';
  r1label: string = '';
  r2label: string = '';
  r3label: string = '';

  r1data: any = '';
  r2data: any = 'CONNECT A WALLET';
  r3data: any = '';
  isWalletConnected:boolean = false;
  ethereum: any;
  provider: any;
  userAccountAddress: string = "";
  totalDividendsRewards:number;
  usdPrice:number;
  bnbPrice:number;
  totalSupply = '';
  burnedTokens = '';
  circulatingSupply = '';
  totalRewardsUSD:number = 0;
  totalPendingRewards:number = 0;
  totalPaidRewards:number = 0;
  pending_safeearn:number = 0;
  penging_BNB:number = 0;
  paidBNB: number = 0;
  paidSafeEarn:number = 0;
  totalPendingUSD:number = 0;
  totalPaidUSD:number = 0;
  safeEarnToUsd:number = 0;
  constructor(private tokenPriceApi:PriceapiService) { }

  async ngOnInit() {
    
    await this.tokenPriceApi.getApolloPrice().subscribe(rate=>{
      this.usdPrice = parseFloat(rate.data.price);
      //this.bnbPrice = parseFloat(rate.data.price_BNB);
    });
    await this.tokenPriceApi.getSafeEarnPrice().subscribe(saferate=>{
      this.safeEarnToUsd = parseFloat(saferate.data.price);
      
    });
    await this.tokenPriceApi.getBNBPrice().subscribe(bnbrate=>{
      this.bnbPrice = bnbrate.data.price;
      this.connectWallet(this.isWalletConnected);
    });
  }
  async walletscript(){
      // Modern dapp browsers...
      if (global.ethereum) {
        this.provider = new Web3(global.ethereum);
        try {
          // Request account access if needed
          await global.ethereum.enable();
          //alert("ethereum enabled");
          var acc = await this.provider.eth.getAccounts();
          this.userAccountAddress = acc[0];
          this.isWalletConnected = true;
          this.r2data = '';
          this.planetImage = '../../assets/images/Globe_WalletConnected.png';
          this.generalData();
          console.log('acc: ',this.userAccountAddress);
          this.initializeContract();
        } catch (error) {
          // User denied account access...
          this.isWalletConnected = false;
        }
      } else if (global.web3) {
        this.provider = new Web3(global.currentProvider);
        var acc = await this.provider.eth.getAccounts();
        this.initializeContract();
      }
      // Non-dapp browsers...
      else {
        this.isWalletConnected = false;
        /* this.toastr.error(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        ); */
      }
 
    try {
      if (global.ethereum) {
       
      } else {
        /* this.toastr.error("Please connect to Metamask"); */
         this.isWalletConnected = false;
      }
      global.ethereum.on("accountsChanged", async (accounts) => {
        //this.getAccount();
        var acc = await this.provider.eth.getAccounts();
        this.isWalletConnected = true;
        this.r2data = '';
        this.planetImage = '../../assets/images/Globe_WalletConnected.png';
        this.generalData();
        this.initializeContract();
        if (acc !== this.userAccountAddress) {
          window.location.reload();
        }
      });
    } catch (err) {
      // console.log("error: ", err);
    }
  }
  connectWallet(isWalletConnected) {
  
    if(isWalletConnected){
      this.provider = null;
      /* this.isWalletConnected = false; */
      
    }else{
      this.walletscript();
    }
    //this.isWalletConnected = true;
  }
  paidRewards() {
    if ( this.isWalletConnected ) {
      this.isButton = 'paidRewards';
      this.statisticLabel = 'PAID REWARDS'
      this.planetImage = '../../assets/images/Globe_WalletPending.png';
      this.r1label = 'BNB';
      this.r1data = this.paidBNB;
      this.r2label = 'SAFEARN';
      this.r2data = this.paidSafeEarn;
      this.r3label = 'TOTAL REWARDS';
      this.r3data = this.totalPaidRewards;
    }
  }
  pendingRewards() {
    if ( this.isWalletConnected ) {
      this.isButton = 'pendingRewards';
      this.statisticLabel = 'PENDING REWARDS'
      this.planetImage = '../../assets/images/Globe_WalletPending.png';
      this.r1label = 'BNB';
      this.r1data = this.penging_BNB;
      this.r2label = 'SAFEARN';
      this.r2data = this.pending_safeearn;
      this.r3label = 'TOTAL REWARDS';
      this.r3data = this.totalPendingRewards;
    }
  }
  generalData() {
    if ( this.isWalletConnected ) {
      this.isButton = 'generalData';
      this.statisticLabel = 'STATISTIC DETAILS'
      this.planetImage = '../../assets/images/Globe_WalletConnected.png';
      this.r1label = 'TOTAL SUPPLY';
      this.r1data = this.totalSupply;
      this.r2label = 'TOTAL BURNED';
      this.r2data = this.burnedTokens;
      this.r3label = 'CIRCULATING SUPPLY';
      this.r3data = this.circulatingSupply;
   }
  }

  async initializeContract() {
    var abi = environment.contractAbi;
    var address = this.smartContractAddress;
    this.contract = await new this.provider.eth.Contract(abi, address);
    await this.contractInfo();
    await this.getUserInfo(this.userAccountAddress);
    
    setInterval(async() => {
      //await this.contractInfo();
      await this.getUserInfo(this.userAccountAddress);
    }, 5000);
  }
  async contractInfo() {
    try {
      var getTotalDividendsDistributed = await this.contract.methods.getTotalDividendsDistributed().call();
      var totalBnbRewards = getTotalDividendsDistributed[0]/(10**18);
      var totalsafearnreward = getTotalDividendsDistributed[1]/(10**9);
      var totalSupply = await this.contract.methods.totalSupply().call();
      this.r1data = totalSupply/(10**18);
      this.totalSupply = this.r1data;
      var burnedTokens = await this.contract.methods.balanceOf('0x000000000000000000000000000000000000dEaD').call();
      this.r2data = burnedTokens/(10**18);
      this.burnedTokens = this.r2data
      var circulatingSupply = this.r1data - this.r2data;
      this.r3data = circulatingSupply;
      this.circulatingSupply = circulatingSupply.toString();

      this.totalRewardsUSD = (totalBnbRewards*this.bnbPrice) + (totalsafearnreward * this.safeEarnToUsd);
     //console.log('totalBnbRewards:::: ',totalBnbRewards*this.bnbPrice);
     //console.log('totalsafearnreward:::: ',totalsafearnreward);
      //console.log('usdPrice: ',this.usdPrice);
      //console.log('totalRewardsUSD: ',this.totalRewardsUSD);
      
     this.generalData();
  
    } catch (error) {
       console.log(error);
    }
  }
  async getUserInfo(address) {
    try {
        //address = '0xC03c42Ac26A5498b8CEF8100563A3167b79e299a';
        var safeEarn_getAccountDividendsInfo = await this.contract.methods.getAccountDividendsInfo(address,1).call();
        var BNB_getAccountDividendsInfo = await this.contract.methods.getAccountDividendsInfo(address,0).call();
        var BNB_paidRewards = BNB_getAccountDividendsInfo[4];
        this.paidBNB = BNB_paidRewards/(10**18);

        var safeEarn_paidRewards = safeEarn_getAccountDividendsInfo[4];
        this.paidSafeEarn = safeEarn_paidRewards/(10**9);

        var BNB_pendingRewards = BNB_getAccountDividendsInfo[3];
        this.penging_BNB = BNB_pendingRewards/(10**18);

        var safeEarn_pendingRewards = safeEarn_getAccountDividendsInfo[3];
        this.pending_safeearn = safeEarn_pendingRewards/(10**9);

        var total_Pending_Rewards = (this.penging_BNB*this.bnbPrice) + (this.pending_safeearn*this.safeEarnToUsd);
        var total_Paid_Rewards = (this.paidBNB*this.bnbPrice) + (this.paidSafeEarn*this.safeEarnToUsd);

        this.totalPendingRewards = total_Pending_Rewards;
        this.totalPaidRewards = total_Paid_Rewards;

        //console.log('BNB_pendingRewards :   ',this.penging_BNB);
        //console.log('bnbPrice :   ',this.bnbPrice);
        //console.log("safeEarn_pendingRewards*this.safeEarnToUsd", this.pending_safeearn*this.safeEarnToUsd);
        //console.log("penging_BNB*this.bnbPrice", this.penging_BNB*this.bnbPrice);
        
    
    } catch (err) {
      //console.log(err);
    }
  }
  async claimRewards() {
    try {
     var txn = await this.contract.methods.claim().send({
       from: this.userAccountAddress,
     });
     //console.log("txn:  ", txn);
   } catch (err) {
     console.log(err);
     /* this.toastr.error(err); */
     }
 }
}
