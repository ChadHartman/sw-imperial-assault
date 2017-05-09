// namespace App.Game.Dice {

//     export interface IAttackResult {
//         name: string;
//         side: IAttackSide;
//     }

//     export interface IDefenseResult {
//         name: string;
//         side: IDefenseSide;
//     }

//     export interface IRollResult {
//         attack: Array<IAttackResult>;
//         defense: Array<IDefenseResult>;
//         damage: number;
//         surge: number;
//         range: number;
//         dodged: boolean;
//     }

//     export function roll(attackDice: Array<string>, defenseDice: Array<string>): IRollResult {

//         let result = {
//             attack: new Array<IAttackResult>(),
//             defense: new Array<IDefenseResult>(),
//             damage: 0,
//             surge: 0,
//             range: 0,
//             dodged: false
//         };

//         for (let name of attackDice) {

//             let attackDie = getAttackDie(name);
//             let side = attackDie.roll();
//             result.attack.push({ name: attackDie.name, side: side });
//             result.damage += side.damage;
//             result.surge += side.surge;
//             result.range += side.range;
//         }

//         for (let name of defenseDice) {

//             let defenseDie = getDefenseDie(name);
//             let side = defenseDie.roll();
//             result.defense.push({ name: defenseDie.name, side: side });
//             if (side.dodge > 0) {
//                 result.dodged = true;
//             }

//             result.damage -= side.block;
//             result.surge -= side.evade;
//         }

//         return result;
//     }

//     function getAttackDie(name: string): AttackDie {
//         switch (name) {
//             case "red":
//                 return RED;
//             case "green":
//                 return GREEN;
//             case "blue":
//                 return BLUE;
//             case "yellow":
//                 return YELLOW;
//         }
//         throw new Error(`Unknown attack die: ${name}`);
//     }

//     function getDefenseDie(name: string): DefenseDie {
//         switch (name) {
//             case "black":
//                 return BLACK;
//             case "white":
//                 return WHITE;
//         }
//         throw new Error(`Unknown defense die: ${name}`);
//     }
// }