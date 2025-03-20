import { Button } from 'antd'
import { memo } from 'react'


function DeactivatedListing() {
    return (
        <div>
            <Button type="primary" danger>下架</Button>
        </div>
    )
}

export default memo(DeactivatedListing)