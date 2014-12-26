
var xmlHttp=null;
var trDeviceGroupA = new Array("TR_1","TR_3","TR_5","TR_7");
var trDeviceGroupB = new Array("TR_2","TR_4","TR_6","TR_8");
var gFreq = new Array();


function simpleOrAdvanced(value)
{ 
    //alert("simpleOrAdvaced");
    var hintParas=new Array("cpri","advanceTR1","advanceTR3","advanceTR5","advanceTR7","advanceTpaAi1",
                                   "advanceTR2","advanceTR4","advanceTR6","advanceTR8","advanceTpaAi2");
    
    if (value == "simple")
    {
    	//alert("simple");
    	//alert(hintParas.length);
    	for(var i=0, len=hintParas.length; i<len; i++)
    	{
    		//alert(hintParas[i]);
    		document.getElementById(hintParas[i]).style.display = "none";
    	}
    }
    else if(value == "advanced")
    {
    	//alert("advanced");
    	for(var i=0, len=hintParas.length; i<len; i++)
    	{
    		//alert(hintParas[i]);
    		document.getElementById(hintParas[i]).style.display = "block";
    	}
    }
    else
    {
        alert("null value for simpleOrAdvanced");
    }
}

function selectRFPort(value, id)
{   
   if(value == true)
   {
      document.getElementById("portSection"+id).style.display = "block";
   }
   else
   {
   	  document.getElementById("portSection"+id).style.display = "none";
   	  uncheckTRdevices(id);
   }
}

function uncheckTRdevices(id)
{	
	if(id == "A")
	{
		for(var i=0; i<trDeviceGroupA.length; i++)
		{
		    document.getElementById(trDeviceGroupA[i]).checked = false;
		    setRadio(trDeviceGroupA[i], false);
		}
	}
	else if(id == "B")
	{
		for(var i=0; i<trDeviceGroupB.length; i++)
		{
		    document.getElementById(trDeviceGroupB[i]).checked = false;
		    setRadio(trDeviceGroupB[i], false);
		}
	}
	updateTpaPara(id);
}

function updateTrDevice(name, value, autoOffset)
{
	var branch = (name.search("A") != -1)?"A":"B";
	var index = name.charAt(name.length-1);
	var offset = 0;
	var manualFreq = false;
	var txFreq = document.getElementById("txFreqTR" + index).value;
	var rxFreq = document.getElementById("rxFreqTR" + index).value;
	
	nullFreq = (txFreq == "0xFFFF") || (rxFreq.value == "0xFFFF");
	if(autoOffset == 0 || (value!=null && nullFreq==true))
	{
	switch(index)
	{
	  case "1":
	  case "2": offset=1; break;
	  case "3":
	  case "4": offset=2; break;
	  case "5":
	  case "6": offset=3; break;
	  case "7":
	  case "8": offset=4; break;
	  default: alert("invalid TR device."); return; 
	  }
  }
	
	updateFreq(name, index, value, offset, branch);
	updateTpaPara(branch);
	setCellBranchId(index, value);
}

function updateFreq(name, index, value, offset, branch)
{
	if(value == "TX")
	{
		updateTxFreq(index, offset);
		resetRxFreq(index);
	}
	else if(value == "RX")
	{
	  updateRxFreq(index ,offset);
	  resetTxFreq(index);
	}
	else if (value == "TX_RX")
	{
	  updateTxFreq(index, offset);
	  updateRxFreq(index, offset);
	}
}

function setCellBranchId(index, value)
{
	var dlCellCarrierBranchId=0;
	var ulCellCarrierBranchId=0;
	
	switch(index)
	{
	case "1": dlCellCarrierBranchId=2;  ulCellCarrierBranchId=1;  break;
	case "2": dlCellCarrierBranchId=10; ulCellCarrierBranchId=3;  break;
	case "3": dlCellCarrierBranchId=4;  ulCellCarrierBranchId=5;  break;
	case "4": dlCellCarrierBranchId=12; ulCellCarrierBranchId=9;  break;
	case "5": dlCellCarrierBranchId=6;  ulCellCarrierBranchId=11; break;
	case "6": dlCellCarrierBranchId=14; ulCellCarrierBranchId=13; break;
	case "7": dlCellCarrierBranchId=8;  ulCellCarrierBranchId=15; break;
	case "8": dlCellCarrierBranchId=16; ulCellCarrierBranchId=17; break;
	default: alert("invalid TR device.");	
	}
	
	//cellbranchId =0 when no RX or TX
	if(value == "RX")
	{
		dlCellCarrierBranchId=0; 
	}
	else if(value == "TX")
	{
		ulCellCarrierBranchId=0;
	}

	document.getElementById("dlCellCarrierBranchIdTR" + index).value = dlCellCarrierBranchId;
	document.getElementById("ulCellCarrierBranchIdTR" + index).value = ulCellCarrierBranchId;
}

function updateTxFreq(index, offset)
{
	var txFreq;
	
	if(offset != 0)
	{
    txFreq = gFreq[2] + 5*offset;
  }
  else
  {
    txFreq = document.getElementById("txFreqTR" + index).value;	
  }
  
	if(checkTxFreq(txFreq) == true)
	{
		document.getElementById("txFreqTR" + index).value = txFreq;
	}
}

function updateRxFreq(index, offset)
{
	var rxFreq;
	
	if(offset != 0)
	{
    rxFreq = gFreq[0] + 5*offset;
  }
  else
  {
    rxFreq = document.getElementById("rxFreqTR" + index).value;	
  }

	if(checkRxFreq(rxFreq) == true)
	{
		document.getElementById("rxFreqTR" + index).value = rxFreq;
	}
}

function checkTxFreq(txFreq)
{
	var txFreqInt = parseInt(txFreq);
	if(txFreqInt == 0xFFFF)
	{
		return true;
	}
	else if(txFreqInt>gFreq[3] || txFreqInt<gFreq[2])
	{
		alert("TX Freq out of range ["+ gFreq[2]+ ", " + gFreq[3] +"]MHz");
		return false;
	}
	else
	  return true;
}

function checkRxFreq(rxFreq)
{
	var rxFreqInt = parseInt(rxFreq);
	
	if(rxFreqInt == 0xFFFF)
	{
		return true;
	}
	else if(rxFreqInt>gFreq[1] || rxFreqInt<gFreq[0])
	{
		alert("RX Freq out of range ["+ gFreq[0]+ ", " + gFreq[1] +"]MHz");
		return false;
	}
	else
  	return true;
}

function resetTxFreq(index)
{
	document.getElementById("txFreqTR" + index).value = "0xFFFF";
}

function resetRxFreq(index)
{
	document.getElementById("rxFreqTR" + index).value = "0xFFFF";
}

function updateTpaPara(branch)
{
	var trDevValue, num = 0;
  var trDeviceGroup = (branch=="A")?trDeviceGroupA:trDeviceGroupB; // be careful when branch expand to more except A and B.
	
  if(document.getElementById(branch).checked == true)
  {
    for(var i=0, len=trDeviceGroup.length; i<len; i++)
    {
      if(document.getElementById(trDeviceGroup[i]).checked == true)
      {
        trDevValue = getRadioValue(getRadioName(trDeviceGroup[i]));
        if(trDevValue == "TX" || trDevValue == "TX_RX")
          num++;
      }
    }
    document.getElementById("numberOfCarriers"+branch).value = num;
    document.getElementById("TpaEnabled"+branch).checked = true;
  }
  
  if(num ==0)
  {
    document.getElementById("TpaEnabled"+branch).checked = false;
  }
  //alert(document.getElementById("numberOfCarriers"+branch).value);
}

function updateFreqValue()
{ 
	var bandValue = document.getElementById("band").value;
  if(bandValue == null)
      return;

	gFreq[0] = parseInt(gBandFreq[bandValue][0])/1000;
	gFreq[1] = parseInt(gBandFreq[bandValue][1])/1000;
	gFreq[2] = parseInt(gBandFreq[bandValue][2])/1000;
	gFreq[3] = parseInt(gBandFreq[bandValue][3])/1000;
	
	var highFreqBandEdge = (gFreq[3]*5).toFixed();//only TX.
  var lowFreqBandEdge  = (gFreq[2]*5).toFixed();
  
	document.getElementById("highFreqBandEdgeA").value = highFreqBandEdge;
	document.getElementById("lowFreqBandEdgeA").value  = lowFreqBandEdge;
	document.getElementById("highFreqBandEdgeB").value = highFreqBandEdge;
	document.getElementById("lowFreqBandEdgeB").value  = lowFreqBandEdge;
}

//updateType: 0-auto type, triggered by band changed;
//            1-manual type, triggered by generate commands.
function updateTrDevInfo(updateType)
{
  for(var i=0, len=trDeviceGroup.length; i<len; i++)
	{
		if(document.getElementById(trDeviceGroup[i]).checked == true)
		{
			var radioName  = getRadioName(trDeviceGroup[i]);
		  var radioValue = getRadioValue(radioName);
		  if(radioValue == null)
		  {
		    return false;
		  }
		  updateTrDevice(radioName, radioValue, updateType);
		}
	}
	return true;
}

function checkPowerClass(value)
{
	if(value>5000 || value<0)
	{
	  alert("invalid power class. [0, 5000]");
	  return false;
	}
}
