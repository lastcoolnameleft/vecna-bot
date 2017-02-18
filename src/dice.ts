export function getDieRoll(input:string) {
  if (/^\d+d\d+/.test(input)) { // 2d10
    let details = input.split('d');
    return [Number(details[0]), Number(details[1])];
  } else {
    return null;
  }
}

export function rolldie(count:number, sides:number) {
  let result = 0;
  for (let i = 0; i <= count; i++) {
    result += Math.floor(Math.random() * sides) + 1;
  }
  return result;
};