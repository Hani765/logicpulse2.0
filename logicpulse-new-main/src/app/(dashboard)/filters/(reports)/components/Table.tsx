"use client"
import { Columns, ClickType } from './columns'
import { DataTable } from '@/components/base/table'

export default function Table({
    endPoint,
    data, token, role }: { data: any, token: string, role: string, endPoint: string }) {
    return (
        <div>
            <DataTable endPoint={endPoint} data={data.data} columns={Columns(token, role)} pagination={data.pagination} token={token} role={role} isSearchable={true}  isStatusFilterable={false} isClickFilterable={true} />
        </div >
    )
}
