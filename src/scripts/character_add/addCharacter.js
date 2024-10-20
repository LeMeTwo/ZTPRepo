/* eslint-disable no-undef */
$().ready(function () {
	const button =
		'<button type="submit" id="addCharacterButton" ' +
		'class="btn btn-outline-secondary btn-lg text-truncate">' + 'Add Character' +
		'</button>';
	$('#addCharacterButton').append(button);
});

$(function () {
	let cid = '';
	const maxCidUrl = 'http://localhost:8081/GetMaxCid';
	fetch(maxCidUrl)
		.then(response => response.json())
		.then(data => {
			data.forEach(character => {
				cid = isNull(character.max[0] + 1);
			});
		})
		.catch(err => console.log(err)); //to file

	$('#add_character_form').submit(function (e) {
		e.preventDefault();

		let selected = [];
		let text = [];

		// Add each text value to the array
		$('#add_character_form input[type=text]').each(function () {
			text.push(this.value);
		});

		// Checkout
		if (text[0].length === 0) {
			alert('You must enter a name.');
			text[0] = '';
		}
		if (text[0].length >= 21) {
			alert('Name can be maximum 20 characters long.');
			text[0] = '';
		}
		// No compulsion to add a surname
		if (text[1].length === 0) {
			text[1] = null;
		}
		if (text[1] !== null) {
			if (text[1].length >= 21) {
				alert('Surname can be maximum 20 characters long.');
				text[1] = '';
			}
		}
		// No compulsion to add age
		if (text[2].length === 0) {
			text[2] = null;
		} else {
			if (isNaN(text[2])) {
				alert('Age must be an integer from 1 to 1000000.');
				text[2] = '';
			} else {
				text[2] = parseFloat(text[2]);
				if (!Number.isSafeInteger(text[2] - parseInt(text[2]))) {
					alert('Age must be an integer from 1 to 1000000.');
					text[2] = '';
				} else {
					text[2] = parseInt(text[2]);
					if (text[2] <= 0 || text[2] >= 1000001) {
						alert('Age must be an integer from 1 to 1000000.');
						text[2] = '';
					}
				}
			}
		}

		// Add selected sex to the array
		$('#add_character_form select').each(function () {
			text.push(parseInt(this.value));
		});

		let sex;
		switch (text[3]) {
		case 1:
			sex = 'male';
			break;
		case 2:
			sex = 'female';
			break;
		case 3:
			sex = 'other';
			break;
		default:
			sex = '';
		}

		// Add each selected checkbox value to the array
		$('#add_character_form input[type=checkbox]:checked').each(function () {
			selected.push(this.value);
		});

		let data = {
			'cid': '{' + cid + '}',
			'name': text[0],
			'surname': text[1],
			'age': text[2],
			'sex': sex,
			'aid': '{' + selected.join(',') + '}',
		};

		if (data.name !== '' && data.surname !== '' && data.age !== '') {
			if (data.surname == null) {
				data.surname = '';
			}
			if (data.age == null) {
				data.age = '';
			}
			postData(data, 'PostAddCharacter')
				.then(response => response.json());

			alert('Character added');
			setTimeout(function () {
				window.location.href = '../Admin.html';
			}, 2000);
			setTimeout(this);
		} else {
			alert('You failed.');
		}
	});
});