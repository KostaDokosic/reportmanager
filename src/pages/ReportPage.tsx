import {
  Box,
  Button,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useContext, useEffect, useState } from "react";
import reportContext from "../context/ReportContext";
import Editor from "../components/Editor";
import Report from "../core/report";
import SortableTableRow from "../components/SortableTableRow";
import ReportManager from "../core/report.manager";
import { handleOpenAICall, PromptType } from "../services/report.service";

export default function ReportsPage() {
  const { reports, createReport, getReport, updateReport, deleteReport } =
    useContext(reportContext);
  const [modal, setModal] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [editReport, setEditReport] = useState<Report | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [orderedReports, setOrderedRepsorts] = useState<Report[]>([]);
  const sensors = useSensors(useSensor(PointerSensor));

  function handleSubmitReport() {
    try {
      if (title?.length === 0 || content?.length === 0) {
        return alert("Title and descriptions are required");
      }

      if (editReport) {
        updateReport(editReport.id, { title, desc: content });
      } else {
        createReport({ title, desc: content });
      }

      setModal(false);
      setContent("");
      setTitle("");
    } catch (e) {
      console.log(e);
      alert("Unknown error, try again.");
    }
  }

  function onDelete(id: string) {
    setModal(false);
    setEditReport(undefined);
    deleteReport(id);
  }

  async function generateWithAI(prompt: PromptType) {
    setLoading(true);
    try {
      const message = await handleOpenAICall(prompt, title, content);
      setContent(message);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (editReport) {
      setTitle(editReport.title);
      setContent(editReport.desc);
    } else {
      setTitle("");
      setContent("");
    }
  }, [editReport]);

  useEffect(() => {
    setOrderedRepsorts(reports);
  }, [reports]);

  return (
    <>
      <h2>Reports</h2>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button
          disabled={loading}
          variant="outlined"
          onClick={() => {
            setModal(true);
            setEditReport(undefined);
          }}
        >
          Create New Report
        </Button>
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          variant="outlined"
          placeholder="Search"
          disabled={loading}
        />
      </Box>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={({ active, over }) => {
          if (active.id !== over?.id) {
            const oldIndex = orderedReports.findIndex(
              (r) => r.id === active.id
            );
            const newIndex = orderedReports.findIndex((r) => r.id === over?.id);
            const newOrder = arrayMove(orderedReports, oldIndex, newIndex);
            setOrderedRepsorts(newOrder);

            const ids = newOrder.map((r) => r.id);
            ReportManager.reorderReports(ids);
          }
        }}
      >
        <SortableContext
          items={orderedReports.map((r) => r.id)}
          strategy={verticalListSortingStrategy}
        >
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell align="right">Edit</TableCell>
                  <TableCell align="right">Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderedReports
                  .filter((report) =>
                    search?.length > 0 ? report.title.includes(search) : report
                  )
                  .map((report, index) => (
                    <SortableTableRow
                      key={report.id}
                      index={index}
                      report={report}
                      onEdit={() => {
                        setEditReport(getReport(report.id));
                        setModal(true);
                      }}
                      onDelete={() => onDelete(report.id)}
                    />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </SortableContext>
      </DndContext>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "70%",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            display: "flex",
            gap: 2,
            flexDirection: "column",
          }}
        >
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            variant="outlined"
            placeholder="Title"
          />
          <Editor value={content} onChange={(val) => setContent(val)} />
          <Box sx={{ flex: 1, display: "flex", gap: 2 }}>
            <Button
              disabled={loading}
              variant="outlined"
              onClick={handleSubmitReport}
            >
              Save Report
            </Button>
            {!editReport && (
              <>
                <Button
                  disabled={loading}
                  variant="outlined"
                  onClick={() => generateWithAI("GENERATE")}
                >
                  Generate Draft Report
                </Button>
                <Button
                  disabled={loading}
                  variant="outlined"
                  onClick={() => generateWithAI("SUMMARIZE")}
                >
                  Summarize Content
                </Button>
              </>
            )}
            <Button
              disabled={loading}
              variant="outlined"
              onClick={() => setModal(false)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
