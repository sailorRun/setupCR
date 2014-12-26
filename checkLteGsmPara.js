var carrFreqMin;
var carrFreqMax;

function updateSubBandFuncOn()
{
  if(document.getElementById("subBandFunctionOn").checked == true)
  {
  	document.getElementById("subBandFunctionOn").value = "0";// 0- on; 1- off.
  	document.getElementById("dlSubBandBandwidthArea").style.display = "block";
  }
  else
  {
    document.getElementById("subBandFunctionOn").value = "1";
    document.getElementById("dlSubBandBandwidthArea").style.display = "none";
    document.getElementById("dlSubBandBandwidth").value = "0";
  }	
}

function updateLteCarrFreqRange()
{ 
	var bandValue = document.getElementById("band").value;
  if(bandValue == null)
      return;

	var ulfmin = parseInt(gBandFreq[bandValue][0]);// for LTE, Unit should be kHz
	var ulfmax = parseInt(gBandFreq[bandValue][1]);
	var dlfmin = parseInt(gBandFreq[bandValue][2]);
	var dlfmax = parseInt(gBandFreq[bandValue][3]);
	var dir    = document.getElementById("receiveTransmit").value;
	var BW     = parseInt(document.getElementById("carrierBandwidth").value);
	
	if(dir == 0)//RX
	{
		carrFreqMin = ulfmin + BW/2;
		carrFreqMax = ulfmax - BW/2;
	}
	else
	{
		carrFreqMin = dlfmin + BW/2;
		carrFreqMax = dlfmax - BW/2;
	}
	document.getElementById("carrFreqRange").innerHTML = "["+carrFreqMin+", " + carrFreqMax +"]kHz";
}

function updateArfcnArea()
{
	var bandValue = document.getElementById("bandArfcn").value;
	if(bandValue == null)
    return;

	document.getElementById("arfcnRange").innerHTML = "[" + gBandArfcn[bandValue][0] + ", " + gBandArfcn[bandValue][1] + "]";
	
	if(bandValue == 5)//bandVIII
	{
		document.getElementById("arfcnRange").innerHTML += " or [" + gBandArfcn[bandValue][2] + ", " + gBandArfcn[bandValue][3] + "]";
	}
}

function checkLGParaRange(ratType)
{
  var devId = parseInt(document.getElementById("devId").value);
  if(devId<0 || devId>255)
  {
    alert("device ID out of range 0-255");
    return false;
  }
  
  if(ratType == 2)//check arfcn
  {
    var arfcnMin = parseInt(document.getElementById("arfcnMin").value);
    var arfcnMax = parseInt(document.getElementById("arfcnMax").value);
    var bandValue = document.getElementById("bandArfcn").value;
    if(bandValue == 5)
    {
      if(arfcnMin<gBandArfcn[bandValue][0] || 
             (arfcnMin>gBandArfcn[bandValue][1])&&(arfcnMin<gBandArfcn[bandValue][2]) || 
              arfcnMin>gBandArfcn[bandValue][3])
    	{
    	  alert("arfcnMin invalid.");
    	  return false;
    	}
    	if(arfcnMax<gBandArfcn[bandValue][0] || 
         (arfcnMax>gBandArfcn[bandValue][1])&&(arfcnMax<gBandArfcn[bandValue][2]) || 
          arfcnMax>gBandArfcn[bandValue][3])
    	{
    	  alert("arfcnMax invalid.");
    	  return false;
    	}
    }
    else
    {
    	if(arfcnMin>arfcnMax)
    	{
    	  alert("arfcnMin should not large than arfcnMax in this band.");
    	  return false;
    	}
    	if(arfcnMin>gBandArfcn[bandValue][1] || arfcnMin<gBandArfcn[bandValue][0])
    	{
    		alert("arfcnMin invalid.");
    	  return false;
    	}
    	if(arfcnMax>gBandArfcn[bandValue][1] || arfcnMax<gBandArfcn[bandValue][0])
    	{
    		alert("arfcnMax invalid.");
    	  return false;
    	}
    }
  }
  else //check frequency
  {
  	var carrFreq = parseInt(document.getElementById("carrierFrequency").value);
  	if(carrFreq<carrFreqMin || carrFreq>carrFreqMax)
  	{
  		alert("carrierFrequency out of range.");
  		return false;
  	}
  }
  
  txCarrPowAll = parseInt(document.getElementById("txCarrierPowerAllocation").value);
  if(txCarrPowAll<=-500 || txCarrPowAll>=0)
  {
    alert("txCarrierPowerAllocation out of range (-500, 0)");
    return false;
  }
  
  return true;
}