import React from 'react'
import { mainLayout2Style } from '../const'
import FileUpload from '../components/modules/fileUpload'
import Setting from '../components/modules/setting'
import ModelOverview from '../components/modules/modelOverview'
import Visualization from '../components/modules/visualization'
import ModelDetail from '../components/modules/modelDetail'
import ActionDetail from '../components/modules/actionDetail'
import { FileDataProvider } from '../contexts/FileDataContext'

const Home = () => {
  return (
    <FileDataProvider>
      <div className="main" style={mainLayout2Style}>
        <FileUpload />
        <Setting />
        <Visualization />
        <ModelDetail />
        <ModelOverview />
        <ActionDetail />
      </div>
    </FileDataProvider>
  )
}

export default Home
