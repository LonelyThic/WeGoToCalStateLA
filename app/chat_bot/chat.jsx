import WheelPicker from '@quidone/react-native-wheel-picker';
import React, { useState } from 'react';

const data = [...Array(100).keys()].map((index) => ({
  value: index,
  label: index.toString(),
}))

const App = () => {
  const [value, setValue] = useState(0);
  return (
    <WheelPicker
      data={data}
      value={value}
      onValueChanged={({ item: { value } }) => setValue(value)}
    />
  );
};

export default App;