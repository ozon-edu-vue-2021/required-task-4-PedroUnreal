<template>
  <div class="form">
    <form id="form" @submit="toValidate" novalidate="true">
      <h1>Личные данные</h1>
        <p v-if="errors.length">
          <b>Пожалуйста исправьте указанные ошибки:</b>
          <ul>
            <li class="error" v-for="error in errors" :key="error">{{ error }}</li>
          </ul>
        </p>
      <div class="fio">
        <div>
          Фамилия
          <input type="text" class="surname" name="surname" v-model="values.surname" id="surname"/>
        </div>
        <div>
          Имя
          <input type="text" class="name" name="name" v-model="values.name"/>
        </div>
        <div>
          Отчество
          <input type="text" class="father" name="father" v-model="values.father" />
        </div>
      </div>
      <div class="wrapper">
        Дата рождения
        <input type="text" class="birth" v-model="values.birthday" placeholder="дд.мм.гггг"/>
      </div>
      <div class="wrapper">
        E-mail
        <input class="email" placeholder="email@email.ru" type="email" name="email" v-model="values.email"/>
      </div>
      <div class="wrapper">
        Пол <br />
        <input type="radio" class="male" name="mail" value="male" v-model="values.checkedSex" /> Мужской
        <input type="radio" name="mail" value="female" v-model="values.checkedSex"/> Женский
      </div>

      <h1>Паспортные данные</h1>
      <div class="passport">
        <div class="citizenship" v-click-outside="hideDropdown">
          <label for="countries"> Гражданство </label>
          <input
            v-model="searchWord"
            id="countries"
            @focus="isDropdownOpen = true"
          />
          <div v-if="isDropdownOpen" class="citizenship-dropdown">
            <ul v-if="countries.length" class="ul-countries">
              <li
                v-for="i in countries.length"
                :key="i"
                @click="chooseCountry(countries[i - 1])"
                class="countries"
              >
                {{ countries[i - 1] }}
              </li>
            </ul>
            <div v-else class="empty" />
          </div>
        </div>
        <div v-if="isRussia" class="passport-rus">
          <div>
            Серия
            <input type="text" class="passeries"  v-model="values.pasSeries"/>
          </div>
          <div>
            Номер
            <input type="text" class="pasnumber" v-model="values.pasNumber" />
          </div>
          <div>
            Дата выдачи
            <input type="text" class="pasdate" />
          </div>
        </div>
        <div v-else><ForPas :getForeignName="getForeignName" :getForeignSurname="getForeignSurname" /></div>
        <div class="wrapper">
          Меняли ли вы фамилию? <br />
          <input type="radio" name="changedsurname" @change="toCheck" checked value="surnamenotchanged"/>
          Нет
          <input type="radio" name="changedsurname" @change="toCheck" value="surnamenchanged"/>
          Да
        </div>
        <div v-if="isChecked" class="prev-fio">
          <div>
            Фамилия
            <input type="text" class="surname"  v-model="values.mothersurname"/>
          </div>
          <div>
            Имя
            <input type="text" class="name" v-model="values.mothername" />
          </div>
        </div>
      </div>
      <div class="button-wrapper">
        <button class="button" type="submit" id="test-click">Отправить</button>
      </div>
    </form>
  </div>
</template>

<script>
import citizenship from "../assets/data/citizenships.json";
import ClickOutside from "vue-click-outside";
import ForPas from "@/components/ForPas.vue";

export default {
  data() {
    return {
      isDropdownOpen: false,
      citizenship,
      countries: [],
      isRussia: true,
      isChecked: false,
      searchWord: "Russia",
      debounced: null,
      //search: "",
      timerId: null,
      values: {
        name: null,
        surname: null,
        father: null,
        birthday: null,
        email: null,
        pasSeries: null,
        pasNumber: null,
        changeSurname: false,
        mothername: null,
        mothersurname: null,
        grajdanstvo: "Russia",
        foreignSurname: null,
        foreignName: null,
        checkedSex: null
      },
      errors: [],
    };
  },
  components: {
    ForPas,
  },
  methods: {
    hideDropdown() {
      this.isDropdownOpen = false;
    },
    chooseCountry(i) {
      this.searchWord = i;
      this.values.grajdanstvo = i;
      this.hideDropdown();
      if (i === "Russia") {
        this.isRussia = true;
      } else {
        this.isRussia = false;
      }
    },
    toCheck() {
      if (this.isChecked === true) {
        this.isChecked = false;
        this.values.changeSurname = false;
      } else if (this.isChecked === false) {
        this.isChecked = true;
        this.values.changeSurname = true;
      }
    },
    debounce(func, t) {
      return function () {
        if (this.timerId === null) {
          this.timerId = setTimeout(() => {
            return func(...arguments);
          }, t);
        } else {
          clearTimeout(this.timerId);
          this.timerId = setTimeout(() => {
            return func(...arguments);
          }, t);
        }
      };
    },
    getCountries(text) {
      return (this.countries = this.citizenship
        .filter((item) =>
          item.nationality.toLowerCase().startsWith(text.toLowerCase())
        )
        .map((item) => item.nationality));
    },
    toValidate(e) {
      e.preventDefault();
      this.errors = [];
      if (!this.values.surname) {
        this.errors.push("Укажите фамилию.");
      } else if (!this.validName(this.values.surname)) {
        this.errors.push("Укажите корректную фамилию на русском");
      }
      if (!this.values.name) {
        this.errors.push("Укажите имя.");
      } else if (!this.validName(this.values.name)) {
        this.errors.push("Укажите корректное имя на русском");
      }
      if (!this.values.father) {
        this.errors.push("Укажите отчество.");
      } else if (!this.validName(this.values.father)) {
        this.errors.push("Укажите корректное отчество на русском");
      }

      if (!this.values.email) {
        this.errors.push("Укажите электронную почту.");
      } else if (!this.validEmail(this.values.email)) {
        this.errors.push("Укажите корректный адрес электронной почты.");
      }

      if (this.isChecked) {
        if (!this.values.mothersurname) {
          this.errors.push("Укажите старую фамилию.");
        } else if (!this.validName(this.values.mothersurname)) {
          this.errors.push("Укажите корректную старую фамилию на русском");
        }
        if (!this.values.mothername) {
          this.errors.push("Укажите старое имя.");
        } else if (!this.validName(this.values.mothername)) {
          this.errors.push("Укажите корректное старое имя на русском");
        }
      }

      if (!this.isRussia) {
        if (!this.values.foreignSurname) {
          this.errors.push("Укажите фамилию загран. паспорта.");
        } else if (!this.validNameEn(this.values.foreignSurname)) {
          this.errors.push(
            "Укажите корректную фамилию загран. паспорта. латинскими буквами"
          );
        }
        if (!this.values.foreignName) {
          this.errors.push("Укажите имя загран. паспорта.");
        } else if (!this.validNameEn(this.values.foreignName)) {
          this.errors.push(
            "Укажите корректное имя загран. паспорта. латинскими буквами"
          );
        }
      }

      if (this.isRussia) {
        if (!this.values.pasSeries) {
          this.errors.push("Укажите серию паспорта.");
        } else if (!this.validPasSeries(this.values.pasSeries)) {
          this.errors.push("Укажите серию паспорта");
        }

        if (!this.values.pasNumber) {
          this.errors.push("Укажите номер паспорта.");
        } else if (!this.validPasNumber(this.values.pasNumber)) {
          this.errors.push("Укажите номер паспорта");
        }
      } else {
        (this.values.pasSeries = null), (this.values.pasNumber = null);
      }
      this.validateDate();
      if (!this.errors.length) {
        //return true;
        console.log(JSON.stringify(this.values));
      }
    },
    validEmail(email) {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    validName(name) {
      const re = /^[а-яА-ЯёЁ]+$/;
      return re.test(name);
    },

    validNameEn(name) {
      const re = /^[A-Za-z]+$/;
      return re.test(name);
    },
    validPasSeries(name) {
      const re = /^\d{4}$/;
      return re.test(name);
    },
    validPasNumber(name) {
      const re = /^\d{6}$/;
      return re.test(name);
    },
    validateDate() {
      if (this.values.birthday === null) {
        this.errors.push("Укажите корректную дату в формате дд.мм.гггг");
      } else {
        let birthday = this.values.birthday;
        const regexVar =
          /(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19|20)\d\d/;
        let regexVarTest = regexVar.test(birthday);
        let userBirthDate = new Date(birthday.split(".").reverse().join("-"));
        var today = new Date();
        if (!regexVarTest) {
          this.errors.push("Укажите корректную дату в формате дд.мм.гггг");
        } else if (userBirthDate > today) {
          this.errors.push("Неправильная дата");
        }
        this.values.birthday = birthday;
      }
    },
    getForeignName(name) {
      this.values.foreignName = name;
    },
    getForeignSurname(name) {
      this.values.foreignSurname = name;
    },
  },
  watch: {
    searchWord(newValue) {
      this.debounced(newValue);
    },
  },
  created: function () {
    this.debounced = this.debounce(this.getCountries, 500);
  },
  mounted: function () {
    this.countries = this.citizenship.map((item) => item.nationality);
  },

  directives: {
    ClickOutside,
  },
};
</script>

<style scoped>
.button-wrapper {
  display: flex;
  justify-content: flex-end;
}

button {
  cursor: pointer;
  text-align: center;
  align-items: flex-start;
  box-sizing: border-box;
  margin: 0em;
  padding: 1px 6px;
}

.citizenship-dropdown {
  border: solid black 1px;
  max-height: 200px;
  background-color: white;
  z-index: 10;
  overflow: auto;
}

.empty {
  background-color: crimson;
  initial-value: "Empty";
}

.error {
  color: red;
}

li:hover.countries {
  background-color: cornflowerblue;
  cursor: pointer;
}

.fio {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 10px;
}

.passport-rus {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  column-gap: 10px;
  margin-top: 8px;
}

input {
  display: block;
  margin-top: 8px;
  width: 100%;
}

input[type="radio"] {
  display: inline-block;
  width: fit-content;
}

.fio input {
  width: 100%;
  margin-top: 8px;
  margin-right: 8px;
}
.passport-info input {
  width: 100%;
  margin-top: 8px;
  margin-right: 8px;
}

.wrapper {
  margin-top: 40px;
}

.birth {
  margin-top: 8px;
}

.prev-fio {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 10px;
  margin-top: 8px;
}

.prev-fio input {
  width: 100%;
  margin-top: 8px;
  margin-right: 8px;
  margin-bottom: 9px;
}
</style>
