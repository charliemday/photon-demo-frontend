import { Checkbox, HStack, Stack, Text } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";

export type RecursiveObject = {
  [key: string]: RecursiveObject | {};
};

// To avoid infinite recursion, we limit the depth of the checklist
const MAX_DEPTH = 3;

export const RecursiveChecklist: FC<{
  /**
   * The object to recursively check
   */
  recursiveObject: RecursiveObject;
  /**
   * The keys of the object to recursively check
   */
  keys: string[];
  /**
   * The parent string to prepend to the key
   */
  parentString: string;
  /**
   * Whether or not the parent has been checked therefore all children should be checked
   * (this still allows for children to be unchecked individually)
   */
  parentChecked?: boolean;
  /**
   * The depth of the checklist to keep track of
   * */
  depth?: number;
  /**
   * The connector for the parent and child string
   */
  connector?: string;
  /**
   * When an item has been checked/unchecked capture it and all of its children
   */
  onChange?: (item: string[], checked: boolean) => void;
}> = ({ recursiveObject, keys, parentString, parentChecked, depth, onChange, connector = "/" }) => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  useEffect(() => {
    if (parentChecked) {
      setCheckedItems(keys);
    } else {
      setCheckedItems([]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentChecked]);

  const findChildren = (key: string, rec: RecursiveObject, parentString: string): string[] => {
    // Recursive function to get all children of a parent
    const children = Object.keys(rec[key]);
    if (children.length > 0) {
      const childItems = children.map((c: string) => findChildren(c, rec[key], parentString));
      return [...childItems.flat()];
    }
    return [`${parentString}${key}`];
  };

  if (depth && depth > MAX_DEPTH) {
    return null;
  }

  if (keys.length > 0) {
    return (
      <>
        {keys.map((key) => {
          const itemChildren = Object.keys(recursiveObject[key]);
          const currentParent = `${parentString}${key}`;
          if (itemChildren.length > 0) {
            return (
              <Stack key={key}>
                <HStack>
                  <Checkbox
                    onChange={(e) => {
                      const currentPath = `${currentParent}${connector}`;
                      const family = findChildren(key, recursiveObject, currentPath);
                      if (e.target.checked) {
                        setCheckedItems([...checkedItems, key]);
                        onChange?.([currentPath, ...family], true);
                      } else {
                        setCheckedItems(checkedItems.filter((item) => item !== key));
                        onChange?.([currentPath, ...family], false);
                      }
                    }}
                    defaultChecked={parentChecked}
                    isChecked={checkedItems.includes(key)}
                  />
                  <Text>
                    {parentString}
                    {key}
                    {connector}
                  </Text>
                </HStack>
                <Stack pl={4}>
                  <RecursiveChecklist
                    recursiveObject={recursiveObject[key]}
                    keys={itemChildren}
                    parentString={`${parentString}${key}/`}
                    parentChecked={checkedItems.includes(key)}
                    depth={depth ? depth + 1 : 1}
                    onChange={onChange}
                  />
                </Stack>
              </Stack>
            );
          } else {
            return (
              <Stack key={key}>
                <HStack>
                  <Checkbox
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCheckedItems([...checkedItems, key]);
                        onChange?.([currentParent], true);
                      } else {
                        setCheckedItems(checkedItems.filter((item) => item !== key));
                        onChange?.([currentParent], false);
                      }
                    }}
                    defaultChecked={parentChecked}
                    isChecked={checkedItems.includes(key)}
                  />
                  <Text>
                    {parentString}
                    {key}
                  </Text>
                </HStack>
              </Stack>
            );
          }
        })}
      </>
    );
  }

  return null;
};
