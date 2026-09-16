import { useInBody } from "../../context/InBodyContext";
import InBodyRecordRow from "./InBodyRecordRow";

export default function InBodyHistoryList() {
  const { records, isLoading } = useInBody();

  if (isLoading) return <p className="placeholder">불러오는 중...</p>;
  if (records.length === 0) return <p className="placeholder">아직 기록이 없습니다</p>;

  return (
    <div className="inbody-history-list">
      {records.map((record, i) => (
        <InBodyRecordRow key={record.id} record={record} previous={records[i + 1]} />
      ))}
    </div>
  );
}
