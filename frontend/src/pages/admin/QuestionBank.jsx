import React from "react"

import NoChoiceQuestion from "../../components/question-bank/no-choice-question.jsx"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import CreateQuestionDialog from "../../components/question-bank/create-question-dialog.jsx"
import GenerateQuestionDialog from "../../components/question-bank/generate-question-dialog.jsx"


function QuestionBank() {
  function handleImportCsv() {
  }

  function handleGenerateAiQuestions() {
    alert("Generate AI Questions clicked")
  }


  return (
      <section className="flex h-full flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-950">
              Question Bank
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Manage and organize questions used in certifications, quizzes, and
              exams.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <CreateQuestionDialog onClickCreateQuestion={handleImportCsv}/>
            <GenerateQuestionDialog onClickGenerateAiQuestions={handleGenerateAiQuestions} />

          </div>
        </div>

        <div>
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">INV001</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Credit Card</TableCell>
                <TableCell className="text-right">$250.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>
  )
}

export default QuestionBank