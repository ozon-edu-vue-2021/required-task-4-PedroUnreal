<template>
  <div>
    <div class="fio">
      <div>
        Фамилия на латинице
        <input
          type="text"
          class="forsurname"
          v-model="foreignSurname"
          @change="setForeignSurname"
        />
      </div>
      <div>
        Имя на латинице
        <input
          type="text"
          class="forname"
          v-model="foreignName"
          @change="setForeignName"
        />
      </div>
      <span class="disclamer">
        Иностранцы заполняют латинскими буквами. Например Ivanov Ivan</span
      >
    </div>
    <div class="info">
      <div>
        Номер паспорта
        <input type="text" class="pasnumber" />
      </div>
      <div class="citizenship" v-click-outside="hideDropdown">
        <label for="countries"> Гражданство </label>
        <input id="countries1" @focus="isDropdownOpen = true" />
        <div v-if="isDropdownOpen" class="citizenship-dropdown">
          <ul v-if="countries.length">
            <li
              v-for="i in countries.length"
              :key="i"
              @click="chooseCountry(countries[i])"
            >
              {{ countries[i] }}
            </li>
          </ul>
          <div v-else class="empty" />
        </div>
      </div>

      <div class="pastype" v-click-outside="hideDropdown2">
        <label for="pastype"> Тип паспорта </label>
        <input id="pastypes" @focus="isDropdownOpen2 = true" />
        <div v-if="isDropdownOpen2" class="citizenship-dropdown">
          <ul v-if="pastypes.length">
            <li
              v-for="i in pastypes.length"
              :key="i"
              @click="choosePas(pastypes[i - 1])"
            >
              {{ pastypes[i - 1] }}
            </li>
          </ul>
          <div v-else class="empty" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pastype from "../assets/data/passport-types.json";
import citizenship from "../assets/data/citizenships.json";
import ClickOutside from "vue-click-outside";

export default {
  data() {
    return {
      isDropdownOpen: false,
      isDropdownOpen2: false,
      citizenship: [],
      pastype: [],
      foreignName: null,
      foreignSurname: null,
    };
  },
  props: ["getForeignName", "getForeignSurname"],
  methods: {
    hideDropdown() {
      this.isDropdownOpen = false;
    },
    hideDropdown2() {
      this.isDropdownOpen2 = false;
    },
    chooseCountry(i) {
      document.getElementById("countries1").value = i;
      this.hideDropdown();
    },
    choosePas(i) {
      document.getElementById("pastypes").value = i;
      this.hideDropdown2();
    },
    setForeignName() {
      this.getForeignName(this.foreignName);
    },
    setForeignSurname() {
      this.getForeignSurname(this.foreignSurname);
    },
  },
  computed: {
    countries() {
      return citizenship.map((item) => item.nationality);
    },
    pastypes() {
      return pastype.map((item) => item.type);
    },
  },
  directives: {
    ClickOutside,
  },
};
</script>

<style scoped>
.fio {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 10px;
  margin-top: 8px;
}

.fio input {
  width: 100%;
  margin-top: 8px;
  margin-right: 8px;
}

.disclamer {
  color: grey;
  font-size: small;
  width: 100%;
}

.info {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 10px;
  margin-top: 8px;
}

.info input {
  width: 100%;
  margin-top: 8px;
  margin-right: 8px;
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

li:hover {
  background-color: cornflowerblue;
  cursor: pointer;
}
</style>
