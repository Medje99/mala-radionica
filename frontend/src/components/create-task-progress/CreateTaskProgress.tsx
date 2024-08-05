/* eslint-disable @typescript-eslint/no-explicit-any */
import type { StepsProps } from 'antd'
import { Popover, Steps } from 'antd'

const customDot: StepsProps['progressDot'] = (dot, { status, index }) => (
  <Popover
    content={
      <span>
        step {index} status: {status}
      </span>
    }
  >
    {dot}
  </Popover>
)
const description = 'You can hover on the dot.'

const CreateProgress = ({ currentPage }: { currentPage: number }) => (
  <Steps
    current={currentPage}
    progressDot={customDot}
    items={[
      {
        title: 'Finished',
        description,
      },
      {
        title: 'In Progress',
        description,
      },
      {
        title: 'Waiting',
        description,
      },
      {
        title: 'Waiting',
        description,
      },
    ]}
  />
)

export default CreateProgress
