if result=$(echo "2\n1" | izi --simple -c ./tests/functionals/endtoend/izi.json -e ./tests/functionals/endtoend/source-file1.sh ./tests/functionals/endtoend/source-file2.sh 2> /dev/null | sed 's/[^[:print:]]//g'); then
	if echo $result | grep -q -E "^\[JThree Six$"; then # [J is the clear screen escape command
		exit 0
	else
		exit 1
	fi
else
	exit 1
fi
