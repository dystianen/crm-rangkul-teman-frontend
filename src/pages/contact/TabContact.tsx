import React from "react";

import TabPanel from 'devextreme-react/tab-panel';
import TabItem from "./TabItem";

export const datas = [{
    ID: 1,
    labelName: 'SuprMart',
    Address: '702 SW 8th Street',
    City: 'Bentonville',
    State: 'Arkansas',
    Zipcode: 72716,
    Phone: '(800) 555-2797',
    Fax: '(800) 555-2171',
    Website: 'http://www.nowebsitesupermart.com',
}, {
    ID: 2,
    labelName: "El'Depot",
    Address: '2455 Paces Ferry Road NW',
    City: 'Atlanta',
    State: 'Georgia',
    Zipcode: 30339,
    Phone: '(800) 595-3232',
    Fax: '(800) 595-3231',
    Website: 'http://www.nowebsitedepot.com',
}, {
    ID: 3,
    labelName: 'K&S Music',
    Address: '1000 Nicllet Mall',
    City: 'Minneapolis',
    State: 'Minnesota',
    Zipcode: 55403,
    Phone: '(612) 304-6073',
    Fax: '(612) 304-6074',
    Website: 'http://www.nowebsitemusic.com',
}, {
    ID: 4,
    labelName: 'Tom Club',
    Address: '999 Lake Drive',
    City: 'Issaquah',
    State: 'Washington',
    Zipcode: 98027,
    Phone: '(800) 955-2292',
    Fax: '(800) 955-2293',
    Website: 'http://www.nowebsitetomsclub.com',
}];

export default class TabContact extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            selectedIndex: 0,
        };
        this.onSelectionChanged = this.onSelectionChanged.bind(this);
    }

    componentDidMount() {
    }

    render() {
        const {
            animationEnabled, loop, selectedIndex, swipeEnabled,
        } = this.state;
        return (
            <div>
                <TabPanel
                    dataSource={datas}
                    selectedIndex={selectedIndex}
                    onOptionChanged={this.onSelectionChanged}
                    itemTitleRender={this.itemTitleRender}
                    bindingOptions={{
                        dataSource: 'tabPanelItems',
                        selectedIndex: 'selectedTab'
                    }}
                    loop={false}
                    animationEnabled={false}
                    swipeEnabled={true}
                    itemComponent={TabItem}
                />
            </div>
        );
    }

    itemTitleRender(data: any) {
        return <span>{data.labelName}</span>;
    }

    onSelectionChanged(args: any) {
        if (args.name === 'selectedIndex') {
            this.setState({
                selectedIndex: args.value,
            });
        }
        return this;
    }
}