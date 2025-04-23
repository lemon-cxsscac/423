// 可調式電阻調整範例程式碼

// 接線說明：
// 可調式電阻：
// 中間腳接 Arduino 的 A0 (類比輸入)
// 其他兩腳分別接 Arduino 的 5V 和 GND

const int potPin = A0; // 可調式電阻接腳

void setup() {
  pinMode(potPin, INPUT);
  Serial.begin(9600); // 用於監控輸入值
}

void loop() {
  int potValue = analogRead(potPin); // 讀取可調式電阻的類比值 (0 到 1023)
  Serial.println(potValue); // 將讀取的值輸出到序列監視器
  delay(100); // 延遲 100 毫秒，避免輸出過快
}
