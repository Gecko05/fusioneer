import { FusionChart } from './smt1/models/fusion-chart';
import { CompendiumConfig } from './smt1/models';
import { fuseTwoDemons } from './compendium/fusions/smt-nonelem-fusions';

import COMP_CONFIG_JSON from './smtif/data/comp-config.json';
import DEMON_DATA_JSON from './smtif/data/demon-data.json';
import SKILL_DATA_JSON from './smtif/data/skill-data.json';
import ALIGNMENT_JSON from './smt2/data/alignments.json';
import FUSION_CHART_JSON from './smt2/data/fusion-chart.json';
import TRIPLE_CHART_JSON from './smt2/data/triple-chart.json';
import ELEMENT_CHART_JSON from './smt2/data/element-chart.json';
import SPECIAL_RECIPES_JSON from './smtif/data/special-recipes.json';

import {Compendium} from './smt1/models/compendium';

function getEnumOrder(target: string[]): { [key: string]: number } {
    const result = {};
    for (let i = 0; i < target.length; i++) {
      result[target[i]] = i;
    }
    return result;
  }

const resistElems = COMP_CONFIG_JSON['resistElems'];
const skillElems = resistElems.concat(COMP_CONFIG_JSON['skillElems']);
const races = [];
const speciesLookup = {};
const species = {};

for (const rs of COMP_CONFIG_JSON['species']) {
    species[rs[0]] = rs.slice(1);
  
    for (const race of rs.slice(1)) {
      speciesLookup[race] = rs[0];
    }
  }
  
  for (const rs of COMP_CONFIG_JSON['species']) {
    species[rs[0]] = rs.slice(1);
  
    for (const race of rs) {
      races.push(race);
    }
  
    for (const race of rs.slice(1)) {
      speciesLookup[race] = rs[0];
    }
  }

const SMT_COMP_CONFIG: CompendiumConfig = {
    appTitle: 'Shin Megami Tensei If...',
    appCssClasses: ['smtnes', 'smtif'],
    races,
    resistElems,
    skillElems,
    baseStats: COMP_CONFIG_JSON['baseStats'],
    baseAtks: COMP_CONFIG_JSON['baseAtks'],
  
    speciesLookup,
    species,
    resistCodes: COMP_CONFIG_JSON['resistCodes'],
    raceOrder: getEnumOrder(races),
    elemOrder: getEnumOrder(skillElems),
    specialRecipes: SPECIAL_RECIPES_JSON,
    useSpeciesFusion: true,
  
    normalLvlModifier: 2.5,
    tripleLvlModifier: -4.75,
    demonData: DEMON_DATA_JSON,
    skillData: SKILL_DATA_JSON,
    alignData: ALIGNMENT_JSON,
    tripleTable: TRIPLE_CHART_JSON,
    elementTable: ELEMENT_CHART_JSON,
    mitamaTable: ELEMENT_CHART_JSON['pairs'],
    darknessRecipes: FUSION_CHART_JSON['darks'],
    normalTable: {
      races: FUSION_CHART_JSON['races'].slice(0, FUSION_CHART_JSON['races'].length - 1),
      table: FUSION_CHART_JSON['table'].slice(0, FUSION_CHART_JSON['table'].length - 1)
    }
  };

let smtifCompendium  = new Compendium(SMT_COMP_CONFIG)
let smtifFusionChart = new FusionChart(SMT_COMP_CONFIG, false)

interface Party {
  demons: string[];
}

function findDemonFusionPath(start: Party, target: string): string[] | null {
  const queue: { party: Party; path: string[] }[] = [{ party: start, path: [] }];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const { party, path } = queue.shift()!;

    for (let i = 0; i < party.demons.length; i++) {
      for (let j = i + 1; j < party.demons.length; j++) {
        console.log("Fusing: ", party.demons[i], party.demons[j])
        const newDemon = fuseTwoDemons(party.demons[i], party.demons[j], smtifCompendium, smtifFusionChart);
        console.log("Resut  : ", newDemon)
       
        if (newDemon === target) {
          return [...path, `${party.demons[i]} + ${party.demons[j]} => ${newDemon}`];
        } 

        if (newDemon === "not_found") {
          continue;
        }

        const newParty = {
          demons: [...party.demons.slice(0, i), ...party.demons.slice(i + 1, j), ...party.demons.slice(j + 1), newDemon],
        };

        const newPartyString = JSON.stringify(newParty.demons.map(demon => demon).sort());

        if (!visited.has(newPartyString)) {
          queue.push({
            party: newParty,
            path: [...path, `${party.demons[i]} + ${party.demons[j]} => ${newDemon}`],
          });
          visited.add(newPartyString);
        }
      }
    }
  }

  return null;
}

// Parse command line arguments.
const args = process.argv.slice(2);
const target = args.pop();
const demons = args.map(name => name);

// Create the starting party.
const start: Party = { demons };

// Find the fusion path.
const path = findDemonFusionPath(start, target);

// Print the fusion path.
if (path) {
  console.log(`Fusion path to ${target}:`);
  path.forEach(step => console.log(step));
} else {
  console.log(`No fusion path found to ${target}.`);
}