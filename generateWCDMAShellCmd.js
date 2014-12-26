// for WCDMA
var SPACE = " ";
var CRLF = "<br/>";
var trDeviceGroup = new Array("TR_1","TR_2","TR_3","TR_4","TR_5","TR_6","TR_7","TR_8");

function generateWCDMACmd()
{
	var completeCmds;
	
  var shellType = getRadioValue("shellType");
	if(shellType == "tsh")
	{
		alert("tsh not supported yet.");
		return false;
	}

	var ratType = document.getElementById("ratType").value;
	if(ratType != "3")
	{
		alert("only WCDMA supported.");
		return false;
	}
  
  if(updateTrDevInfo(1)==false)
  {
    alert("Please select carrier type.");
    return false;	
  }
  
  var cpriCmd = getCpriCmd();
  var aiSetupCmd = getAiSetUpCmd();
  var bdconfCmd = getBdconfCmd(trDeviceGroup);
  var tpaSetupCmd = getTpaSetupCmd();
  var tpaModPowerCmd = getTpaModPowerCmd();
  var crSetupCmd = getCrSetupCmd(trDeviceGroup);
  var crTxOnCmd = getCrTxOnCmd(trDeviceGroup);

	completeCmds = cpriCmd +
	            aiSetupCmd +
	            bdconfCmd  +
	           tpaSetupCmd +
	        tpaModPowerCmd +
	            crSetupCmd +
	            crTxOnCmd;

	document.getElementById("txtHint").innerHTML = completeCmds;
	
	return false; // keep page static
}

function getCpriCmd()
{
  var result = "cpri linkstatus " +
               document.getElementById("portNo").value + SPACE +
               document.getElementById("hfnSync").value + SPACE +
               document.getElementById("linkOp").value + SPACE +
               document.getElementById("syncBit").value + SPACE +
               document.getElementById("tAdv").value + SPACE +
               document.getElementById("refClkPort").value + "(simulator only)" + CRLF;
	return result;
}

function getAiSetUpCmd()
{
  var results = "";
  
  var aiDevice1Exist = document.getElementById("TR_1").checked || document.getElementById("TR_3").checked ||
                       document.getElementById("TR_5").checked || document.getElementById("TR_7").checked;
  var aiDevice2Exist = document.getElementById("TR_2").checked || document.getElementById("TR_4").checked ||
                       document.getElementById("TR_6").checked || document.getElementById("TR_8").checked;
  
  if(aiDevice1Exist == true)
      results += AiSetUpSingleCmd("A");
  
  if(aiDevice2Exist == true)
      results += AiSetUpSingleCmd("B");
  
	return results;
}

function AiSetUpSingleCmd(branch)
{
   return ("ai setup " +
               document.getElementById("devId"+branch).value + SPACE +
               document.getElementById("tmaMode"+branch).value + SPACE +
               document.getElementById("ulBr1"+branch).value + SPACE +
               document.getElementById("ulBr2"+branch).value + SPACE +
               document.getElementById("ulBr3"+branch).value + SPACE +
               document.getElementById("ulBr4"+branch).value + SPACE +
               document.getElementById("dlBr1"+branch).value + SPACE +
               document.getElementById("dlBr2"+branch).value + SPACE +
               document.getElementById("dlBr3"+branch).value + SPACE +
               document.getElementById("dlBr4"+branch).value + SPACE +
               document.getElementById("dualPaMode"+branch).value + CRLF);
}

function getBdconfCmd(trDeviceGroup)
{
  var result = "";

  for(var i=1, len=trDeviceGroup.length; i<=len; i++)
  {
  	if(document.getElementById(trDeviceGroup[i-1]).checked)
  	{
      result += "ru bdconf2 " +
               document.getElementById("connectorIdTR"+i.toString()).value + SPACE +
               document.getElementById("dlSlotIdTR"+i.toString()).value + SPACE +
               document.getElementById("ulSlotIdTR"+i.toString()).value + SPACE +
               document.getElementById("dlPortIdTR"+i.toString()).value + SPACE +
               document.getElementById("ulPortIdTR"+i.toString()).value + SPACE +
               document.getElementById("dlCellCarrierBranchIdTR"+i.toString()).value + SPACE +
               document.getElementById("ulCellCarrierBranchIdTR"+i.toString()).value + SPACE +
               document.getElementById("axcIdDlTR"+i.toString()).value + SPACE +
               document.getElementById("axcIdUlTR"+i.toString()).value + CRLF;
    }  
  }
	return result;
}

function getTpaSetupCmd()
{
  var results = "";
  
  updateTpaPara("A");
  updateTpaPara("B");
  if(document.getElementById("TpaEnabledA").checked)
  {
    results += TpaSetupSingleCmd("A");
  }
  
  if(document.getElementById("TpaEnabledB").checked)
  {
    results += TpaSetupSingleCmd("B");
  }
  
  return results;
}

function TpaSetupSingleCmd(branch)
{
	return ("tpa setup " +
               document.getElementById("tpaId"+branch).value + SPACE +
               document.getElementById("maxPowerConsumption"+branch).value + SPACE +
               document.getElementById("numberOfCarriers"+branch).value + SPACE +
               document.getElementById("lowFreqBandEdge"+branch).value + SPACE +
               document.getElementById("highFreqBandEdge"+branch).value + CRLF);
}

function getTpaModPowerCmd()
{
  var results = "";
  
  // come on!!
  if(document.getElementById("TpaEnabledA").checked)
  {
    results += TpaModPowerSingleCmd("A");
  }
  
  if(document.getElementById("TpaEnabledB").checked)
  {
    results += TpaModPowerSingleCmd("B");
  }
  
  return results;
}

function TpaModPowerSingleCmd(branch)
{
	return ("tpa modpower " +
               document.getElementById("devId"+branch).value + SPACE +
               document.getElementById("powerClass"+branch).value + CRLF);
}

function getCrSetupCmd(trDeviceGroup)
{
  var result = "";
  var txFreq, rxFreq;

  for(var i=1, len=trDeviceGroup.length; i<=len; i++)
  {
  	if(document.getElementById(trDeviceGroup[i-1]).checked)
  	{
  		txFreq = document.getElementById("txFreqTR"+i.toString()).value;
  		rxFreq = document.getElementById("rxFreqTR"+i.toString()).value;
  		if(txFreq != "0xFFFF")
  		{
  			txFreq = ajustFreq(txFreq);
  		}
  		if(rxFreq != "0xFFFF")
  		{
  			rxFreq = ajustFreq(rxFreq);
  		}
  		
      result += "tr cr setup " +
               txFreq + SPACE +
               document.getElementById("chiprateTR"+i.toString()).value + SPACE +
               rxFreq + SPACE +
               document.getElementById("trIdTR"+i.toString()).value + CRLF;
    }
  }
	return result;
}

function ajustFreq(freq)
{
  var freqInt = parseInt(freq);
  return freqInt*5;
}

function getCrTxOnCmd(trDeviceGroup)
{
	var result = "";

  for(var i=1, len=trDeviceGroup.length; i<=len; i++)
  {
  	if(document.getElementById(trDeviceGroup[i-1]).checked == true)
  	{
  	  if(document.getElementById("txFreqTR"+i.toString()).value != "0xFFFF")
  	  {
        result += "tr tx on " + document.getElementById("trIdTR"+i.toString()).value + CRLF;
      }
    }
  }
	return result;
}
