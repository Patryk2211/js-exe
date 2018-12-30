
function printNumbers()
{
	var number1 = document.getElementById("field1").value;
	var number2 = document.getElementById("field2").value;
	var numbers = "";

	if(number1 == "" && number2 == "")
		document.getElementById("result").innerHTML="Both fields are empty!";
	else if(number1 == "") 
		document.getElementById("result").innerHTML="Left field is empty!";

	else if(number2 == "")
		document.getElementById("result").innerHTML="Right field is empty!";

	else if((number1 != parseInt(number1)) && (number2 != parseInt(number2)))
		document.getElementById("result").innerHTML="Both fields aren't integers!";

	else if(number1 != parseInt(number1)) 
		document.getElementById("result").innerHTML="Left field isn't integer!";

	else if(number2 != parseInt(number2))
		document.getElementById("result").innerHTML="Right field isn't integer!";
	
	else if(number1 == number2)
		document.getElementById("result").innerHTML="Numbers are equal!";
 
	else if(number2 >= number1)
	{
		for(var i = number1; i <= number2; i++)
			numbers = numbers + i + " ";
		document.getElementById("result").innerHTML=numbers;
	}
	else if(number1 >= number2)
	{
		for(var i = number1; i >= number2; i--)
			numbers = numbers + i + " ";
		document.getElementById("result").innerHTML=numbers;
	}
	else document.getElementById("result").innerHTML="Wrong input, please do it again!";
}
