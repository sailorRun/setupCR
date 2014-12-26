var SPACE = " ";
var CRLF = "<br/>";

function generateLTEGSMCmd()
{
	var completeCmds;
	
  var shellType = getRadioValue("shellType");
	if(shellType == "tsh")
	{
		alert("tsh not supported yet.");
		return false;
	}

	var ratType = document.getElementById("ratType").value;
	if(ratType == "3")
	{
		alert("should NOT WCDMA in this case.");
		return false;
	}
	
	if(checkLGParaRange(ratType) == false)
	  return false;

  updateSubBandFuncOn();
  updateLteCarrFreqRange();
  var trDcSetupCmd  = getTrDcSetupCmd(ratType);
  var trDcOnCmd = getTrDcOnCmd();

	completeCmds = trDcSetupCmd +
	            trDcOnCmd;

	document.getElementById("txtHint").innerHTML = completeCmds;
	
	return false; // keep page static
}

function getTrDcSetupCmd(ratType)
{
	var carrFreq      = (ratType=="2") ? "0" : document.getElementById("carrierFrequency").value;
	var txCarrGainSet = (ratType=="2") ? document.getElementById("txCarrGainSetting").value : "0";
	var arfcnMin      = (ratType=="2") ? document.getElementById("arfcnMin").value : "0";
	var arfcnMax      = (ratType=="2") ? document.getElementById("arfcnMax").value : "0";
	
  var result = "trdc setup3 " +
               document.getElementById("devId").value + SPACE +
               document.getElementById("ratType").value + SPACE +
               document.getElementById("receiveTransmit").value + SPACE +
               carrFreq + SPACE +
               arfcnMin + SPACE +
               arfcnMax + SPACE +
               document.getElementById("txCarrierPowerAllocation").value + SPACE +
               document.getElementById("carrierBandwidth").value + SPACE +
               document.getElementById("frameStartOffset").value + SPACE +
               document.getElementById("setupRfPort").value + SPACE +
               txCarrGainSet + SPACE +
               document.getElementById("subBandFunctionOn").value + SPACE +
               document.getElementById("dlSubBandBandwidth").value + SPACE +
               document.getElementById("dlSubBandIqDataScalingMode").value + SPACE +
               document.getElementById("bbSampleRate").value + SPACE +
               document.getElementById("noOfCpriLinks").value + SPACE +
               document.getElementById("cpriPort").value + SPACE +
               document.getElementById("axcId").value + SPACE +
               document.getElementById("axcIdRxControl").value + SPACE +
               document.getElementById("iqPos").value + SPACE +
               document.getElementById("bfOffset").value + CRLF;

	return result;
}

function getTrDcOnCmd()
{
	var results = "trdc on " + document.getElementById("devId").value + CRLF;
	
	return results;
}
