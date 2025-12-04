import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "@/layout/DashboardLayout";
import { fetchHealthRecords } from "@/features/healthRecords/healthRecordSlice";
import HealthRecordList from "@/components/health/HealthRecordList";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const HealthRecordsPage = () => {
  const dispatch = useDispatch();
  const { list, loading, pagination } = useSelector(
    (state) => state.healthRecords
  );

  useEffect(() => {
    dispatch(fetchHealthRecords({ page: 1, limit: 20 }));
  }, [dispatch]);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-lg font-semibold">Health Records</h1>
          <p className="text-xs text-muted-foreground">
            View your OPD visits, diagnosis and prescriptions.
          </p>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Records</CardTitle>
          </CardHeader>
          <CardContent>
            <HealthRecordList records={list} loading={loading} />
            {pagination?.total > pagination?.limit && (
              <p className="mt-3 text-[11px] text-muted-foreground">
                Showing {list.length} of {pagination.total} records.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HealthRecordsPage;
