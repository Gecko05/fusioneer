import { NamePair, Compendium, FusionChart, Demon, ElemModifiers } from '../models';

function findBin(n: number, bins: number[]): number {
  if (!bins.length) {
    return -1;
  }

  let index = 0;

  for (const bin of bins) {
    if (n > bin) {
      index++;
    }
  }

  return index === bins.length ? index - 1 : index;
}

export function fuseTwoDemons(nameA: string, nameB: string, compendium: Compendium, fusionChart: FusionChart): string {
  if (nameA == undefined || nameB == undefined || nameA == nameB) {
    return "not_found";
  }
  const { race: raceA, lvl: lvlA } = compendium.getDemon(nameA);
  const { race: raceB, lvl: lvlB } = compendium.getDemon(nameB);

  // Fuse with same race
  if (raceA === raceB) {
    const elementResult = fusionChart.getRaceFusions(raceA)[raceA];
    const ingLvls2 = compendium.getIngredientDemonLvls(raceA).filter(lvl => lvl !== lvlA);
    const recipes: NamePair[] = [];

    return elementResult;
  }

  // Fuse with element
  if (compendium.isElementDemon(nameB)) {
    const recipes: NamePair[] = [];

    const resultModifier = fusionChart.getElemFusions(nameB)[raceA]
    const lvlsR = compendium.getResultDemonLvls(raceA)

    const bin = findBin(lvlA, lvlsR) + resultModifier;

    if (bin !== -1 && lvlsR[bin] !== 100 && (raceA != raceB || lvlA != lvlB)) {
      const nameR = compendium.reverseLookupDemon(raceA, lvlsR[bin]);
      return nameR;
    }

    return "not_found";
  } else if (compendium.isElementDemon(nameA)){
    const recipes: NamePair[] = [];

    const resultModifier = fusionChart.getElemFusions(nameA)[raceB]
    const lvlsR = compendium.getResultDemonLvls(raceB)

    const bin = findBin(lvlB, lvlsR) + resultModifier;

    if (bin !== -1 && lvlsR[bin] !== 100 && (raceA != raceB || lvlA != lvlB)) {
      const nameR = compendium.reverseLookupDemon(raceB, lvlsR[bin]);
      return nameR;
    }

    return "not_found";
  }

  // Fuse with different race
  const raceR = fusionChart.getRaceFusion(raceA, raceB)
  const lvlsR = compendium.getResultDemonLvls(raceR);
  const binsB = lvlsR.map(lvl => 2 * (lvl - fusionChart.lvlModifier) - lvlA);
  const binB = findBin(lvlB, binsB);

  if (binB !== -1 && lvlsR[binB] !== 100 && (raceA != raceB || lvlA != lvlB)) {
    const nameR = compendium.reverseLookupDemon(raceR, lvlsR[binB]);
    return nameR;
  }

  return "not_found";
}

export function fuseWithDiffRace(name: string, compendium: Compendium, fusionChart: FusionChart): NamePair[] {
  const recipes: NamePair[] = [];
  const { race: raceA, lvl: lvlA } = compendium.getDemon(name);

  for (const [raceB, raceR] of Object.entries(fusionChart.getRaceFusions(raceA))) {
    const lvlsR = compendium.getResultDemonLvls(raceR);
    const binsB = lvlsR.map(lvl => 2 * (lvl - fusionChart.lvlModifier) - lvlA);

    for (const lvlB of compendium.getIngredientDemonLvls(raceB)) {
      const binB = findBin(lvlB, binsB);

      if (binB !== -1 && lvlsR[binB] !== 100 && (raceA != raceB || lvlA != lvlB)) {
        const nameR = compendium.reverseLookupDemon(raceR, lvlsR[binB]);

        if (nameR === name && binB + 1 < lvlsR.length) {
          recipes.push({
            name1: compendium.reverseLookupDemon(raceB, lvlB),
            name2: compendium.reverseLookupDemon(raceR, lvlsR[binB + 1])
          });
        } else {
          recipes.push({
            name1: compendium.reverseLookupDemon(raceB, lvlB),
            name2: nameR
          });
        }
      }
    }
  }

  for (const name2 of compendium.reverseLookupSpecial(name)) {
    const specIngreds = compendium.getSpecialNameEntries(name2);

    if (specIngreds.length === 2) {
      const name1 = specIngreds[0] === name ? specIngreds[1] : specIngreds[0];

      for (const pair of recipes) {
        if (pair.name1 === name1) {
          pair.name2 = name2;
        }
      }
    }
  }

  return recipes;
}

export function fuseWithSameRace(name: string, compendium: Compendium, fusionChart: FusionChart): NamePair[] {
  const { race: ingRace1, lvl: ingLvl1 } = compendium.getDemon(name);
  const elementResult = fusionChart.getRaceFusions(ingRace1)[ingRace1];
  const ingLvls2 = compendium.getIngredientDemonLvls(ingRace1).filter(lvl => lvl !== ingLvl1);
  const recipes: NamePair[] = [];

  if (elementResult && compendium.isElementDemon(elementResult)) {
    for (const ingLvl2 of ingLvls2) {
      recipes.push({
        name1: compendium.reverseLookupDemon(ingRace1, ingLvl2),
        name2: elementResult
      });
    }
  }

  return recipes;
}

export function fuseWithElement(name: string, compendium: Compendium, fusionChart: FusionChart): NamePair[] {
  const recipes: NamePair[] = [];
  const { race: ingRace1, lvl: ingLvl1 } = compendium.getDemon(name);

  const resultLvls = [0, 0].concat(compendium.getResultDemonLvls(ingRace1), [100, 100]);
  if (resultLvls.indexOf(ingLvl1) < 0) {
    resultLvls.push(ingLvl1);
    resultLvls.sort((a, b) => a - b);
  }

  const ingLvlIndex1 = resultLvls.indexOf(ingLvl1);
  const elementModifiers = fusionChart.getElemModifiers(ingRace1);
  const elementOffsets = Object.keys(elementModifiers).map(x => parseInt(x, 10));

  for (const offset of elementOffsets) {
    const resultLvl = resultLvls[ingLvlIndex1 + offset];

    if (resultLvl !== 0 && resultLvl !== 100) {
      const resultName = compendium.reverseLookupDemon(ingRace1, resultLvl);

      for (const elementName of elementModifiers[offset]) {
        recipes.push({
          name1: elementName,
          name2: resultName
        });
      }
    }
  }

  return recipes;
}
