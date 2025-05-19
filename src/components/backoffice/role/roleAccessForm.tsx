import React, {FormEventHandler, useCallback, useEffect, useRef, useState} from "react";
import Form, {
  ButtonItem,
  ButtonOptions,
  EmailRule, GroupItem,
  PatternRule,
  RequiredRule,
  SimpleItem
} from "devextreme-react/form";
import {allowOnlyNumbers, allowOnlyText} from "../../../utils/helpers";
import {LoadIndicator} from "devextreme-react";
import MultiSelect from "../../multiselect";
