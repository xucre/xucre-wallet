import { useEffect } from "react";
import { useRecoilState, RecoilValue, RecoilState } from "recoil";

export const RecoilObserver = ({node, _value}: {node: RecoilState<any>, _value: any}) => {
  const [, updateValue] = useRecoilState(node);
  useEffect(() => updateValue(_value), [node, _value]);
  return null;
};

