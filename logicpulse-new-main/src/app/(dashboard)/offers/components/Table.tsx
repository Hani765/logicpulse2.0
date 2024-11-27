"use client"
import { Columns, OfferType } from './columns'
import { DataTable } from '@/components/base/table'

export default function Table({
    endPoint,
    data, token, role }: { data: any, token: string, role: string, endPoint: string }) {
    return (
        <div>
            <DataTable endPoint={endPoint} data={data.data} role={role} token={token} columns={Columns(token, role)} pagination={data.pagination} isSearchable={true} />
        </div >
    )
}
