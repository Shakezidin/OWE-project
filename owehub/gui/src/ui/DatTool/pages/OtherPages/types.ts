// Define valid MPPT numbers
export type MpptNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

// Create MPPT key type using literal types
export type MpptKey = 'mppt1' | 'mppt2' | 'mppt3' | 'mppt4' | 'mppt5' | 'mppt6' | 'mppt7' | 'mppt8';

export interface MpptConfig {
  s1: string;
  s2: string;
}

export interface InverterConfigParent {
  inverter: string;
  max: string | number;
  mppt1: MpptConfig;
  mppt2: MpptConfig;
  mppt3: MpptConfig;
  mppt4: MpptConfig;
  mppt5: MpptConfig;
  mppt6: MpptConfig;
  mppt7: MpptConfig;
  mppt8: MpptConfig;
}

export interface StringInverterProps {
  parentConfig: InverterConfigParent;
  onParentChange: (field: 'inverter' | 'max', value: string | number) => void;
  onConfigChange: (mppt: MpptKey, field: keyof MpptConfig, value: string) => void;
}