import { Tree } from 'antd';
import React, { useEffect, useState } from 'react'
import type { TreeDataNode, TreeProps } from 'antd';
import { forEachTreeCb, treeArray } from '../../../util';
import { notHide, treeEmployee,treeAtt } from '../data';

interface Props {
    select: any[],
    handleSelect: any
}
const treeData = treeArray({data: [...treeEmployee,...treeAtt],keyValue: "key",parentField:"parent_key"}).map(cl => {
  // if(notHide.includes(cl.key)){
  //   cl.disabled = true
  // }
  return forEachTreeCb({data: cl,fielNameChild:"children",fielNameUpdate:"disabled", valueUpdate: true,fiel_compare:"key",values_compare:notHide})
})
function TreeColumn({select,handleSelect}:Props) {
    
      const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
        handleSelect(checkedKeysValue as React.Key[]);
      };
    return (
        <>
            <Tree
                className="pt-3"
                checkable
                onCheck={onCheck}
                checkedKeys={select}
                treeData={treeData}
              />
        </>
    )
}

export default TreeColumn