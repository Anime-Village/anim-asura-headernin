"use strict";

let nickname="";
let asunaToken=0;

//Asuna token address
let ContractAddress="0xC656B2279B0FdF761e832133B06CE607fBBcbceb";

// Etherscan API key
let ApiKeyToken="FPF18WR1MIHBWYBQ13HUETMRKVXEXFN4ZK";	

// Unpkg imports
const {WalletLink} = require('walletlink');
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const Fortmatic = window.Fortmatic;

// Web3modal instance
let web3Modal

// Chosen wallet provider given by the dialog window
let provider;

// Address of the selected account
let selectedAccount="";

/**
 * Setup the orchestra
 */
function init() {

  console.log("WalletConnectProvider is", WalletConnectProvider);
  console.log("Fortmatic is", Fortmatic);
  console.log("window.web3 is", window.web3, "window.ethereum is", window.ethereum);

  // Tell Web3modal what providers we have available.
  // Built-in web browser provider (only one can exist as a time)
  // like MetaMask, Brave or Opera is added automatically by Web3modal
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        // Mikko's test key - don't copy as your mileage may vary
        infuraId: "8043bb2cf99347b1bfadfb233c5325c0",
      }
    },

    fortmatic: {
      package: Fortmatic,
      options: {
        // Mikko's TESTNET api key
        key: "pk_test_887467F2DC5BBFB4"
      }
    },
    'custom-walletlink': {
      display: {
        logo: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzgzcHgiIGhlaWdodD0iMzgzcHgiIHZpZXdCb3g9IjAgMCAzODMgMzgzIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA1NC4xICg3NjQ5MCkgLSBodHRwczovL3NrZXRjaGFwcC5jb20gLS0+CiAgICA8dGl0bGU+d2FsbGV0bGluazwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPgogICAgICAgIDxyZWN0IGlkPSJwYXRoLTEiIHg9IjAiIHk9IjAiIHdpZHRoPSIzODMiIGhlaWdodD0iMzgzIiByeD0iNjQiPjwvcmVjdD4KICAgICAgICA8bGluZWFyR3JhZGllbnQgeDE9IjQ5Ljk5OTk5MzglIiB5MT0iMCUiIHgyPSI0OS45OTk5OTM4JSIgeTI9IjEwMCUiIGlkPSJsaW5lYXJHcmFkaWVudC0zIj4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzJFNjZGOCIgb2Zmc2V0PSIwJSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMTI0QURCIiBvZmZzZXQ9IjEwMCUiPjwvc3RvcD4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPC9kZWZzPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IndhbGxldGxpbmsiPgogICAgICAgICAgICA8ZyBpZD0iUGF0aCI+CiAgICAgICAgICAgICAgICA8bWFzayBpZD0ibWFzay0yIiBmaWxsPSJ3aGl0ZSI+CiAgICAgICAgICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjcGF0aC0xIj48L3VzZT4KICAgICAgICAgICAgICAgIDwvbWFzaz4KICAgICAgICAgICAgICAgIDxyZWN0IHN0cm9rZT0iIzk3OTc5NyIgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSIzODIiIGhlaWdodD0iMzgyIiByeD0iNjQiPjwvcmVjdD4KICAgICAgICAgICAgICAgIDxwb2x5Z29uIGZpbGw9InVybCgjbGluZWFyR3JhZGllbnQtMykiIGZpbGwtcnVsZT0ibm9uemVybyIgbWFzaz0idXJsKCNtYXNrLTIpIiBwb2ludHM9IjAgMCAzODMgMCAzODMgMzg0IDAgMzg0Ij48L3BvbHlnb24+CiAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPHBhdGggZD0iTTYwLjEwNzQsMTkxLjU3MiBDNjAuMTA3NCwyNjQuOTY2IDExOS42MDUsMzI0LjQ2MyAxOTIuOTk4LDMyNC40NjMgQzI2Ni4zOTIsMzI0LjQ2MyAzMjUuODg5LDI2NC45NjYgMzI1Ljg4OSwxOTEuNTcyIEMzMjUuODg5LDExOC4xNzkgMjY2LjM5Miw1OC42ODE2IDE5Mi45OTgsNTguNjgxNiBDMTE5LjYwNSw1OC42ODE2IDYwLjEwNzQsMTE4LjE3OSA2MC4xMDc0LDE5MS41NzIgWiBNMTU5LjAzNywxNDguNzUyIEMxNTQuMTQ0LDE0OC43NTIgMTUwLjE3OCwxNTIuNzE4IDE1MC4xNzgsMTU3LjYxMSBMMTUwLjE3OCwyMjUuNTMzIEMxNTAuMTc4LDIzMC40MjYgMTU0LjE0NCwyMzQuMzkzIDE1OS4wMzcsMjM0LjM5MyBMMjI2Ljk1OSwyMzQuMzkzIEMyMzEuODUyLDIzNC4zOTMgMjM1LjgxOCwyMzAuNDI2IDIzNS44MTgsMjI1LjUzMyBMMjM1LjgxOCwxNTcuNjExIEMyMzUuODE4LDE1Mi43MTggMjMxLjg1MiwxNDguNzUyIDIyNi45NTksMTQ4Ljc1MiBMMTU5LjAzNywxNDguNzUyIFoiIGlkPSJTaGFwZSIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+',
        name: 'Coinbase',
        description: 'Scan with Coinbase to connect',
      },
      options: {
        appName: 'ERC721 Mint', // Your app name
        networkUrl: 'https://cloudflare-eth.com',
        chainId: 1,
      },
      package: WalletLink,
      connector: async (_, options) => {
        const { appName, networkUrl, chainId } = options
        const walletLink = new WalletLink({
          appName
        });
        const provider = walletLink.makeWeb3Provider(networkUrl, chainId);
        await provider.enable();
        return provider;
      },
    }
  };

  web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions, // required
    disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
  });

  console.log("Web3Modal instance is", web3Modal);
}

/**
 * Kick in the UI action after Web3modal dialog has chosen a provider
 */
async function fetchAccountData() {

  // Get a Web3 instance for the wallet
  const web3 = new Web3(provider);

  console.log("Web3 instance is", web3);

  // Get connected chain id from Ethereum node
  const chainId = await web3.eth.getChainId();
  
  // Get list of accounts of the connected wallet
  const accounts = await web3.eth.getAccounts();

  selectedAccount = accounts[0];
  //selectedAccount = '0x095E4e53905B74A389546653C177AdB1cCd8C7f6';
  console.log("selectedAccount: ", selectedAccount)

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {    	
    	var data=JSON.parse(this.responseText);
    	if(data.message=="OK"){
  			const balance=data.result;
        asunaToken = Math.floor(web3.utils.fromWei(balance, "kether"));
  		} else {
  			alert(data.result);
  		}
    }
  };
  xhttp.open("GET", 'https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress='+ContractAddress+'&address='+selectedAccount+'&tag=latest&apikey='+ApiKeyToken, true);
  xhttp.send();

  document.querySelector("#connectwallet").style.display = "none";
  document.querySelector("#playnow").style.display = "block";
}

/**
 * Fetch account data for UI when
 * - User switches accounts in wallet
 * - User switches networks in wallet
 * - User connects wallet initially
 */
async function refreshAccountData() {  
  await fetchAccountData(provider);  
}

/**
 * Connect wallet button pressed.
 */
async function onConnect() {

  console.log("Opening a dialog", web3Modal);
  try {
    provider = await web3Modal.connect();
  } catch(e) {
    console.log("Could not get a wallet connection", e);
    return;
  }

  // Subscribe to accounts change
  provider.on("accountsChanged", (accounts) => {
    fetchAccountData();
  });

  // Subscribe to chainId change
  provider.on("chainChanged", (chainId) => {
    fetchAccountData();
  });

  // Subscribe to networkId change
  provider.on("networkChanged", (networkId) => {
    fetchAccountData();
  });

  await refreshAccountData();
}

function submitName(){
	nickname=document.getElementById("ninjianame").value;
	if(nickname!=""){
		document.querySelector("#menu").style.display = "block";
		document.querySelector("#inputname").style.display = "none";		
	}else
		alert("INSERT A NICKNAME!!!")
}
function getScore(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     document.getElementById("ranking").innerHTML = this.responseText;
    }
  };
  xhttp.open("POST", "score/getdata.php", true);
  xhttp.send();

  document.querySelector("#leaderboard").style.display = "block";
}
window.addEventListener('load', async () => {
  init();

  // input name
  document.querySelector("#submit").addEventListener("click", submitName);
  var input = document.getElementById("ninjianame");
  input.addEventListener("keyup", function(event) {
  	if (event.keyCode === 13) {
		event.preventDefault();
		submitName()
	}
  });

  // Connect Wallet
  document.querySelector("#connectwallet").addEventListener("click", onConnect);
  
  // play Game
  document.querySelector("#playnow").addEventListener("click", function(){
  	if(asunaToken>=0){		
		document.querySelector("#menu").style.display = "none";
		var sence = require("scripts/sence");
		sence.switchSence( "game-body" );
	} else
		alert("Current Asuna token is "+asunaToken+" trillion.\nAt least 250 trillion require!"); 
  });
  document.querySelector("#goleader").addEventListener("click", getScore);
  document.querySelector("#return").addEventListener("click", function(){
  	document.querySelector("#leaderboard").style.display = "none";
  });
  document.querySelector("#gomenu").addEventListener("click", function(){
  	  var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	console.log(this.responseText);
			document.querySelector("#gameover").style.display = "none";
  			document.querySelector("#menu").style.display = "block";
	    }
	  };
	  xhttp.open("GET", "score/insert.php?name="+nickname+"&score="+ninjiascore+"&wallet="+selectedAccount, true);
	  xhttp.send();
  });
  document.querySelector("#goleader2").addEventListener("click", function(){
  	  var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	console.log(this.responseText);
	    	getScore();
			document.querySelector("#gameover").style.display = "none";
  			document.querySelector("#menu").style.display = "block";
	    }
	  };
	  xhttp.open("GET", "score/insert.php?name="+nickname+"&score="+ninjiascore+"&wallet="+selectedAccount, true);
	  xhttp.send();
  });
});