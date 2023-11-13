const { a, b, c, d, e, f, g, h } = require("./tests");

function serialize(numbers) {
  let binaryString = numbers.reduce((acc, num) => {
    let binary = num.toString(2);
    return acc + binary.padStart(9, "0");
  }, "");

  if (binaryString.length % 8 !== 0) {
    binaryString = binaryString.padEnd(
      binaryString.length + 8 - (binaryString.length % 8),
      "0"
    );
  }

  const bytes = [];
  for (let i = 0; i < binaryString.length; i += 8) {
    bytes.push(parseInt(binaryString.substring(i, i + 8), 2));
  }

  const buffer = new Buffer.from(bytes);
  return buffer.toString("base64");
}

function deserialize(str) {
  const buffer = new Buffer.from(str, "base64");
  const binaryString = buffer.reduce(
    (acc, byte) => acc + byte.toString(2).padStart(8, "0"),
    ""
  );

  const numbers = [];
  for (let i = 0; i < binaryString.length; i += 9) {
    const numBinary = binaryString.substring(i, i + 9);
    const num = parseInt(numBinary, 2);
    if (num !== 0) numbers.push(num);
  }

  return numbers;
}

function measureSize(array, serialized) {
  // в js все числа представлены как 64 битные числа с плавающей запятой
  // значит каждое число занимает 8 байт 
  // размер массива в байтах будет равен количеству элементов умноженному на 8
  const originalArraySize = array.length * 8;
  // каждый символ в js строке обычно занимает либо 1 байт (для ascii символов)
  // наша base64 строка состоит из ascii символов, значит каждый символ займет 1 байт
  const serializedStringSize = serialized.length;

  console.log(`Размер исходного массива: ${originalArraySize} байтов`);
  console.log(`Размер сериализованной строки: ${serializedStringSize} байтов`);
  return {originalArraySize, serializedStringSize}
}

function test() {
  let tests = [ a, b, c, d, e, f, g, h ]

  for(let test of tests) {
    let serialized = serialize(test)
    console.log(`Исходный массив:`, test);
    console.log(`Сериализованная строка:`, serialized);
    console.log(`Результат десериализации равен исходному массиву:`, JSON.stringify(deserialize(serialized)) === JSON.stringify(test));
    const {originalArraySize, serializedStringSize} = measureSize(test, serialized)
    // если коэфициент сжатия равен 2 это значит что данные сжаты на 50%
    // если коэфициент сжатия больше 2 это значит что данные сжаты БОЛЕЕ чем на 50%
    console.log(`Коэфициент сжатия: `, originalArraySize / serializedStringSize);
  }
}
test()