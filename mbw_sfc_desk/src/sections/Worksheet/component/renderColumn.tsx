import { TableCustom } from "../../../components";

export interface column {
    parent_key: string | null,
    key: string,
    title: string,
    children: column[] | []
}
interface renderProps {
    data_column: column,
    fix_left_column: string[],
    fix_right_column: string[],
}

const { Column, ColumnGroup } = TableCustom;
export function renderColumn({ data_column, fix_left_column = [], fix_right_column = [] }: renderProps) {
    if (data_column.children?.length > 0) {
        return <ColumnGroup title={data_column.title} className="!min-w-[670px]" {...fix_left_column.includes(data_column.key) && { fixed: "left" }}
            {...fix_right_column.includes(data_column.key) && { fixed: "right" }}>
            {
                data_column.children?.map(dt => renderColumn({ data_column: dt, fix_left_column, fix_right_column }))
            }
        </ColumnGroup>
    }

    return <Column
        {...fix_left_column.includes(data_column.key) && { fixed: "left" }}
        {...fix_right_column.includes(data_column.key) && { fixed: "right" }}
        className="!text-center"
        title={data_column.title}
        dataIndex={data_column.key}
        key={data_column.key}
    />

}