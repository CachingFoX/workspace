<script setup>
import { onMounted } from 'vue'
import { ref } from 'vue'
import { watch } from 'vue'
import { computed } from 'vue'
import { toCurrency, toPercent } from './formatter.js'
import { berechneEinkommensteuer } from './steuer.js'


// Eingaben
const incoming = ref(35000)
const abfindung = ref(235000)
const lohnersatzleistungen = ref(2500)

// Berechnete Werte
const zvE = computed(() => Number(incoming.value) + Number(abfindung.value));
const zvE_5tel = computed(() => Number(incoming.value) + Number(abfindung.value)/5);
const fiktives_zvE = computed(() => zvE.value + Number(lohnersatzleistungen.value))
const fiktives_zvE_5tel = computed(() => zvE_5tel.value + Number(lohnersatzleistungen.value))

const steuersatz_zvE = computed(() => berechneEinkommensteuer(zvE.value) / zvE.value);
const steuersatz_fzvE = computed(() => berechneEinkommensteuer(fiktives_zvE.value) / zvE.value);

const steuerlast_zvE = computed(() => zvE.value * steuersatz_zvE.value);
const steuerlast_fzvE = computed(() => zvE.value * steuersatz_fzvE.value);


const steuerlast_einkommen = computed(() => berechneEinkommensteuer(incoming.value));
const steuersatz_einkommen = computed(() => steuerlast_einkommen.value / incoming.value);

const steuerlast_einkommen_pvb = computed(() => berechneEinkommensteuer(incoming.value + lohnersatzleistungen.value));

const steuerlast_abfindung = computed(() => steuerlast_zvE.value - steuerlast_einkommen.value);
const steuerlast_abfindung_pvb = computed(() => steuerlast_fzvE.value - steuerlast_einkommen_pvb.value);

const steuersatz_abfindung = computed(() => steuerlast_abfindung.value / abfindung.value);
const steuersatz_abfindung_pvb = computed(() => steuerlast_abfindung_pvb.value / abfindung.value);

const steuerlast_zvE_5tel = computed(() => berechneEinkommensteuer(zvE_5tel.value));
const steuersatz_zvE_5tel = computed(() => steuerlast_zvE_5tel.value / zvE_5tel.value);

const steuerlast_zvE_abfindung = computed(() => (steuerlast_zvE_5tel.value-steuerlast_einkommen.value)*5+steuerlast_einkommen.value);
const steuersatz_zvE_abfindung = computed(() => steuerlast_zvE_abfindung.value / zvE.value);

const steuersatz_zvE_5tel_pvb = computed(() => berechneEinkommensteuer(fiktives_zvE_5tel.value) / fiktives_zvE_5tel.value);
const steuerlast_zvE_5tel_pvb = computed(() => zvE_5tel.value * steuersatz_zvE_5tel_pvb.value);



// -------------------------------------------------------------

const steuer = ref(0) // einkommen
const steuersatz = ref(0)
const steuer_pvb = ref(0) // pvb = progressionsvorbehalt
const steuersatz_pvb = ref(0)

const steuer_abfindung = ref(0)
// const steuersatz_abfindung = ref(0)
const steuer_abfindung_pvb = ref(0)
// const steuersatz_abfindung_pvb = ref(0)


const steuer_t = ref(0)
const steuersatz_t = ref(0)
const steuer_t_pvb = ref(0)
const steuersatz_t_pvb = ref(0)

const steuer_fuenftel = ref(0)
const steuersatz_fuenftel = ref(0)

function berechne() {
  steuer.value = berechneEinkommensteuer(incoming.value)
  steuersatz.value = steuer.value / incoming.value

  steuersatz_pvb.value = berechneEinkommensteuer(incoming.value + lohnersatzleistungen.value) / (incoming.value + lohnersatzleistungen.value)
  steuer_pvb.value = steuersatz_pvb.value * incoming.value;

  steuer_t.value = berechneEinkommensteuer(Number(incoming.value) + Number(abfindung.value))
  steuersatz_t.value = steuer_t.value / (Number(incoming.value) + Number(abfindung.value))

  let zvE = Number(incoming.value) + Number(abfindung.value)
  let virtE = zvE + lohnersatzleistungen.value
  steuersatz_t_pvb.value = berechneEinkommensteuer(virtE) / virtE;
  steuer_t_pvb.value = zvE * steuersatz_t_pvb.value


  steuer_abfindung.value = steuer_t.value - steuer.value
  steuersatz_abfindung.value = steuer_abfindung.value / abfindung.value

  // steuersatz_abfindung_pvb.value = berechneEinkommensteuer(incoming.value + lohnersatzleistungen.value) / (incoming.value + lohnersatzleistungen.value)
  // steuer_abfindung_pvb.value = steuersatz_abfindung_pvb.value * abfindung.value -




  console.log(berechneEinkommensteuer(Number(incoming.value) + Number(abfindung.value)/5));
  console.log(steuer.value);
  console.log(berechneEinkommensteuer(Number(incoming.value) + Number(abfindung.value)/5)-steuer.value);

  steuer_fuenftel.value = (berechneEinkommensteuer(Number(incoming.value) + Number(abfindung.value)/5)-steuer.value)*5+steuer.value;

  steuersatz_fuenftel.value = steuer_fuenftel.value / (Number(incoming.value) + Number(abfindung.value))
}



onMounted(() => {
  berechne()
});

watch(incoming, (newVal) => {
  berechne()
});
watch(abfindung, (newVal) => {
  berechne()
});
watch(lohnersatzleistungen, (newVal) => {
  berechne()
});
</script>

<template>
  <table>
    <tbody>
      <tr>
        <th>Einkommen</th>
        <td><input v-model.number="incoming" inputmode="numeric" placeholder="Einkommen" /> EUR</td>
      </tr>

      <tr>
        <th>Lohnersatzleistungen</th>
        <td><input v-model.number="lohnersatzleistungen" inputmode="numeric" placeholder="Lohnersatzleistungen" /> EUR</td>
      </tr>

      <tr>
        <th>Abfindung</th>
        <td><input v-model.number="abfindung" inputmode="numeric" placeholder="Abfindung" /> EUR</td>
      </tr>

      <tr>
        <td>zvE</td>
        <td>{{ toCurrency(zvE) }}</td>
        <td>{{ toPercent(steuersatz_zvE) }}</td>
        <td>von</td>
        <td>{{ toCurrency(zvE) }}</td>
        <td>ergibt</td>
        <td>{{ toCurrency(steuerlast_zvE) }}</td>
      </tr>
      <tr>
        <td>fiktives zvE</td>
        <td>{{ toCurrency(fiktives_zvE) }}</td>
        <td>{{ toPercent(steuersatz_fzvE) }}</td>
        <td>von</td>
        <td>{{ toCurrency(zvE) }}</td>
        <td>ergibt</td>
        <td>{{ toCurrency(steuerlast_fzvE) }}</td>

      </tr>
      <tr>
        <td colspan="2"></td>
        <td colspan="5">+{{ toCurrency(steuerlast_fzvE-steuerlast_zvE) }} höhere Steuerlast durch Progressionsvorbehalt</td>
      </tr>
      <tr>
        <td> </td>
      </tr>

      <tr>
        <td><b>Mit Fünftel-Regelung</b></td>
      </tr>

      <tr>
        <td>Steuerlast auf Einkommen</td>
        <td></td>
        <td>{{ toPercent(steuersatz_einkommen) }}</td>
        <td>auf</td>
        <td>{{ toCurrency(incoming) }}</td>
        <td>ergibt</td>
        <td>{{ toCurrency(steuerlast_einkommen) }}</td>
      </tr>

      <tr>
        <td>zvE mit 1/5 Abfindung</td>
        <td></td>
        <td>{{ toPercent(steuersatz_zvE_5tel) }}</td>
        <td>auf</td>
        <td>{{ toCurrency(zvE_5tel) }}</td>
        <td>ergibt</td>
        <td>{{ toCurrency(steuerlast_zvE_5tel) }}</td>
      </tr>

      <tr>
        <td>Differenz</td>
        <td>{{ toCurrency(steuerlast_zvE_5tel-steuerlast_einkommen) }}</td>
        <td>x5 = </td>
        <td>{{ toCurrency((steuerlast_zvE_5tel-steuerlast_einkommen)*5) }}</td>
      </tr>

      <tr>
        <td>Steuerlast</td>
        <td></td>
        <td>{{ toPercent( steuersatz_zvE_abfindung ) }}</td>
        <td>von</td>
        <td>{{ toCurrency( zvE ) }}</td>
        <td>ergibt</td>
        <td>{{ toCurrency( steuerlast_zvE_abfindung ) }}</td>
        <td></td>
      </tr>

      <tr>
        <td colspan="2"></td>
        <td colspan="5">{{ toCurrency(steuerlast_zvE-steuerlast_zvE_abfindung) }} Ersparnis durch Fünftel-Regelung</td>
      </tr>


      <tr>
        <td><b>Mit Fünftel-Regelung und Progressionsvorbehalt</b></td>
      </tr>

      <tr>
        <td>Steuerlast auf Einkommen</td>
        <td></td>
        <td>{{ toPercent(steuersatz_fzvE) }}</td>
        <td>auf</td>
        <td>{{ toCurrency(zvE) }}</td>
        <td>ergibt</td>
        <td>{{ toCurrency(steuerlast_fzvE) }}</td>
      </tr>

      <tr>
        <td>zvE mit 1/5 Abfindung</td>
        <td></td>
        <td>{{ toPercent(steuersatz_zvE_5tel) }}</td>
        <td>auf</td>
        <td>{{ toCurrency(zvE_5tel) }}</td>
        <td>ergibt</td>
        <td>{{ toCurrency(steuerlast_zvE_5tel) }}</td>
      </tr>

      <tr>
        <td>Differenz</td>
        <td>{{ toCurrency(steuerlast_zvE_5tel-steuerlast_einkommen) }}</td>
        <td>x5 = </td>
        <td>{{ toCurrency((steuerlast_zvE_5tel-steuerlast_einkommen)*5) }}</td>
      </tr>

      <tr>
        <td>Steuerlast</td>
        <td></td>
        <td>{{ toPercent( steuersatz_zvE_abfindung ) }}</td>
        <td>von</td>
        <td>{{ toCurrency( zvE ) }}</td>
        <td>ergibt</td>
        <td>{{ toCurrency( steuerlast_zvE_abfindung ) }}</td>
        <td></td>
      </tr>

      <tr>
        <td colspan="2"></td>
        <td colspan="5">{{ toCurrency(steuerlast_zvE-steuerlast_zvE_abfindung) }} Ersparnis durch Fünftel-Regelung</td>
      </tr>

      <!--
      <tr>
        <td>fiktives zvE</td>
        <td>{{ toCurrency(fiktives_zvE_5tel) }}</td>
        <td>{{ toPercent(steuersatz_zvE_5tel_pvb) }}</td>
        <td>von</td>
        <td>{{ toCurrency(zvE_5tel) }}</td>
        <td>ergibt</td>
        <td>{{ toCurrency(steuerlast_fzvE) }}</td>
        <td>+{{ toCurrency(steuerlast_fzvE-steuerlast_zvE) }}</td>
      </tr>
    -->

    </tbody>
  </table>

<div style="display: none;">
const zvE = computed(() => Number(incoming.value) + Number(abfindung.value));
const zvE_5tel = computed(() => Number(incoming.value) + Number(abfindung.value)/5);
const fiktives_zvE = computed(() => zvE.value + Number(lohnersatzleistungen.value))
const fiktives_zvE_5tel = computed(() => zvE_5tel.value + Number(lohnersatzleistungen.value))

const steuersatz_zvE = computed(() => berechneEinkommensteuer(zvE.value) / zvE.value);
const steuersatz_fzvE = computed(() => berechneEinkommensteuer(fiktives_zvE.value) / fiktives_zvE.value);

const steuerlast_zvE = computed(() => zvE.value * steuersatz_zvE.value);
const steuerlast_fzvE = computed(() => zvE.value * steuersatz_fzvE.value);

const steuerlast_einkommen = computed(() => berechneEinkommensteuer(incoming.value));


const steuerlast_einkommen_pvb = computed(() => berechneEinkommensteuer(incoming.value + lohnersatzleistungen.value));

const steuerlast_abfindung = computed(() => steuerlast_zvE.value - steuerlast_einkommen.value);
const steuerlast_abfindung_pvb = computed(() => steuerlast_fzvE.value - steuerlast_einkommen_pvb.value);

const steuersatz_abfindung = computed(() => steuerlast_abfindung.value / abfindung.value);
const steuersatz_abfindung_pvb = computed(() => steuerlast_abfindung_pvb.value / abfindung.value);

const steuerlast_zvE_5tel = computed(() => berechneEinkommensteuer(zvE_5tel.value);
const steuersatz_zvE_5tel = computed(() => steuerlast_zvE_5tel.value / zvE_5tel.value);

const steuersatz_zvE_5tel_pvb = computed(() => berechneEinkommensteuer(fiktives_zvE_5tel.value) / fiktives_zvE_5tel.value);
const steuerlast_zvE_5tel_pvb = computed(() => zvE_5tel.value * steuersatz_zvE_5tel_pvb.value);


  <table>
    <thead>
      <tr>
        <th></th>
        <th>Betrag</th>
        <th>fiktives zvE</th>
        <th>Steuersatz</th>
        <th></th>
        <th>zvE</th>
        <th>Steuerlast</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>Einkommen</th>
        <td><input v-model.number="incoming" inputmode="numeric" placeholder="Einkommen" /> EUR</td>
        <td>{{ toCurrency(incoming) }}</td>
        <td>{{ toPercent(steuersatz) }}</td>
        <td>von</td>
        <td>{{ toCurrency(incoming) }}</td>
        <td>{{ steuer.toFixed(2) }} EUR</td>
      </tr>

      <tr>
        <th>... mit Lohnersatzleistungen</th>
        <td><input v-model.number="lohnersatzleistungen" inputmode="numeric" placeholder="Lohnersatzleistungen" /> EUR</td>
        <td>{{ toCurrency(incoming+lohnersatzleistungen) }}</td>
        <td>{{ toPercent(steuersatz_pvb) }}</td>
        <td>von</td>
        <td>{{ toCurrency(incoming) }}</td>
        <td>{{ toCurrency(steuer_pvb) }}</td>
        <td>+{{ toCurrency(steuer_pvb-steuer) }}</td>
      </tr>

      <tr>
        <th>Abfindung</th>
        <td><input v-model.number="abfindung" inputmode="numeric" placeholder="Abfindung" /> EUR</td>
        <td></td>
        <td>{{ toPercent(steuersatz_abfindung) }}</td>
        <td></td>
        <td></td>
        <td>{{ toCurrency(steuer_abfindung) }}</td>
      </tr>

      <tr>
        <th>... mit Lohnersatzleistungen</th>
        <td></td>
        <td></td>
        <td>{{ toPercent(steuersatz_abfindung_pvb) }}</td>
        <td></td>
        <td></td>
        <td>{{ toCurrency(steuer_abfindung_pvb) }}</td>
      </tr>

      <tr>
        <th>Gesamt</th>
        <td></td>
        <td></td>
        <td>{{ toPercent(steuersatz_t) }}</td>
        <td>von</td>
        <td></td>
        <td>{{ toCurrency(steuer_t) }}</td>
      </tr>

      <tr>
        <th>... mit Lohnersatzleistungen</th>
        <td></td>
        <td></td>
        <td>{{ toPercent(steuersatz_t_pvb) }}</td>
        <td>von</td>
        <td></td>
        <td>{{ toCurrency(steuer_t_pvb) }}</td>
      </tr>

      <tr>
        <th>Fünftelregelung</th>
        <td></td>
        <td>{{ steuer_fuenftel.toFixed(2) }} EUR</td>
        <td>{{ toPercent(steuersatz_fuenftel) }}</td>
      </tr>
      <tr>
        <th>Ersparnis</th>
        <td></td>
        <td>{{ (steuer_t - steuer_fuenftel).toFixed(2) }} EUR</td>
        <td></td>
      </tr>
    </tbody>
  </table>


</div>

  <hr/>
  <p>Gesamt Einkommen: {{ Number(incoming) + Number(abfindung) }}</p>

  <p>Einkommensteuer: {{ steuer_t.toFixed(2) }} EUR ({{ steuersatz_t.toFixed(2) }}%)</p>


</template>

<style scoped>
.left {
  text-align: left;
}
tbody th:first-child {
  text-align: left;
}
td:nth-child(3), td:nth-child(7) {
  text-align: right;
}
</style>
