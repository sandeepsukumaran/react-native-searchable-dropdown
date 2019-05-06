import React, { Component } from 'react';
import {
  Text,
  ListView,
  FlatList,
  TextInput,
  View,
  TouchableOpacity,
  Keyboard
} from 'react-native';

import PropTypes from 'prop-types';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });


export default class SearchableDropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: {},
      listItems: [],
      focus: false
    };
    this.defaultItemValue = {}
    this.defaultItemValue[this.props.labelField] = this.props.defaultLabelValue;
    this.defaultItemValue[this.props.idField] = this.props.defaultIdValue;
  }

  renderList = () => {
    if (this.state.focus) {
      return (
        <ListView
          style={{ ...this.props.itemsContainerStyle }}
          keyboardShouldPersistTaps='always'
          dataSource={ds.cloneWithRows(this.state.listItems)}
          renderRow={this.renderItems}
        />
      );
    }
  };

  renderFlatList = () => {
    if (this.state.focus) {
      return (
        <FlatList
          style={{ ...this.props.itemsContainerStyle }}
          keyboardShouldPersistTaps='always'
          data={this.state.listItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => this.renderItems(item)}
        />
      );
    }
  };

  componentDidMount = () => {
    const listItems = this.props.items;
    const defaultIndex = this.props.defaultIndex;

    if (defaultIndex && listItems.length > defaultIndex) {
      this.setState({
        listItems,
        item: listItems[defaultIndex]
      });
    } else {
      this.setState({ listItems });
    }
  };

  searchedItems = searchedText => {
    let ac = this.props.items.filter(function(item) {
      return item.name.toLowerCase().indexOf(searchedText.toLowerCase()) > -1;
    });
    let item = {
      id: -1,
      name: searchedText,
    };
    this.setState({ listItems: ac, item: item });
    const onTextChange = this.props.onTextChange;

    if (onTextChange && typeof onTextChange === 'function') {
      setTimeout(() => {
        onTextChange(searchedText);
      }, 0);
    }
  };

  renderItems = item => {
    return (
      <TouchableOpacity
        style={{ ...this.props.itemStyle }}
        onPress={() => {
          this.setState({ item: item, focus: false });
          Keyboard.dismiss();
          setTimeout(() => {
            this.props.onItemSelect(item);

            if (this.props.resetValue) {
              this.setState({ focus: true, item: this.defaultItemValue });
              this.input.focus();
            }
          }, 0);
        }}
      >
        <Text style={{ ...this.props.itemTextStyle }}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  renderListType = () => {
    return this.props.listType === 'ListView'
      ? this.renderList()
      : this.renderFlatList();
  };

  render = () => {
    return (
      <View
        keyboardShouldPersist='always'
        style={{ ...this.props.containerStyle }}
      >
        <TextInput
          ref={e => (this.input = e)}
          underlineColorAndroid={this.props.underlineColorAndroid}
          onFocus={() => {
            this.setState({
              focus: true,
              item: this.defaultItemValue,
              listItems: this.props.items
            });
          }}
          onChangeText={text => {
            this.searchedItems(text);
          }}
          value={this.state.item[this.props.labelField]}
          style={{ ...this.props.textInputStyle }}
          placeholderTextColor={this.props.placeholderTextColor}
          placeholder={this.props.placeholder}
        />
        {this.renderListType()}
      </View>
    );
  };
}

SearchableDropDown.defaultProps = {
  idField: 'id',
  labelField: 'name',
  listType: 'FlatList',
  defaultLabelValue: '',
  defaultIdValue: 0,
}

SearchableDropDown.PropTypes = {
  items: PropTypes.array.isRequired,
  idField: PropTypes.string,
  labelField: PropTypes.string,
  underlineColorAndroid: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  textInputStyle: PropTypes.string,
  listType: PropTypes.oneOf(['FlatList', 'ListView']),
  defaultLabelValue: PropTypes.string,
  defaultIdValue: PropTypes.number,
  defaultIndex: PropTypes.number,
  onTextChange: PropTypes.func,
  containerStyle: PropTypes.oneOf([PropTypes.array, PropTypes.object]),
  itemTextStyle: PropTypes.oneOf([PropTypes.array, PropTypes.object]),
  itemsContainerStyle: PropTypes.oneOf([PropTypes.array, PropTypes.object]),
  itemStyle: PropTypes.oneOf([PropTypes.array, PropTypes.object]),
  onItemSelect: PropTypes.func,
  resetValue: PropTypes.func,
}
