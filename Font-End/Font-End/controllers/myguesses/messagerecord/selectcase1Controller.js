/**
 * selectcase1/消息列表
 */
var keHuId = window.localStorage.getItem("keHuId");
var cityName = window.localStorage.getItem("cityName");
define(['app', 'jquery','handler','_swipe','../../../services/myguesses/messagerecord/selectcaseServices'], function(app, $,handler,selectcaseServices) {
app.controller('Selectcase1Ctrl', function($scope,selectcaseServices) {
		//设置界面标题
		handler.setTitle("消息记录");
		//判断用户是否登陆
		handler.isKeHuID();
		//initParam();
		$scope.nomsg = true;
		//总页数
		$scope.pageTotal = 0;
	  //当前页码
		$scope.pageIndex = 1;
		//当前页显示数量
		$scope.pageSize = 11;
		//是否显示提示框 true显示 false不显示
		$scope.commit = false;
		//弹出框标题
		$scope.commitTitle = "估宝宝提醒";
		//弹出框信息
		$scope.commitMsg = "";
		//弹出操作为删除还是标记读取 true为删除 false为标记读取
		$scope.deleteOrRead = true;
		//勾选的消息数量
		$scope.checkItemCount = 0;
		//勾选的消息
		$scope.checkItem = "";
		//获取报告进度结果
		getData($scope,selectcaseServices,$scope.pageIndex,$scope.pageSize);
		//获取选择的消息编号
		function getSelectItem(){
			$scope.checkItem = "";
			$scope.checkItemCount = 0;
			var key = "bor_color_brown";
			$("input.bor").each(function(){
				if($(this).attr("class").indexOf(key) != -1){
					$scope.checkItem += $(this).attr("tag")+","
					$scope.checkItemCount +=1;
				}
			})
			if($scope.checkItem.length > 0){
				$scope.checkItem = $scope.checkItem.substring(0,$scope.checkItem.length - 1)
			}
		}
		//全选
		$scope.selectAll = function (){
			var key = "btn-selected";
			if($('#btnSelectAll').attr("class").indexOf(key) == -1){
				$("input.bor").each(function(){
					$(this).addClass("bor_color_brown");
				})
				$('#btnSelectAll').addClass(key);
			}else{
				$("input.bor").each(function(){
					$(this).removeClass("bor_color_brown");
				})
				$('#btnSelectAll').removeClass(key);
			}
		}
		//标记删除
		$scope.delete = function (){
			//当前操作为删除
			$scope.deleteOrRead = true;
			//获取勾选的消息
			getSelectItem();
			//有消息
			if($scope.checkItem.length > 0){
				//显示确认和取消按钮
				dialogButtonOp(false);
				if($scope.checkItemCount == $scope.pageSize){
					$scope.commitMsg = "您是否确认删除全部消息记录？删除之后，不可恢复";
				}else{
					$scope.commitMsg = "您是否确认删除该消息记录？删除之后，不可恢复";
				}
			}else{
				//显示知道了按钮
				dialogButtonOp(true);
				$scope.commitMsg = "您至少需选择一个消息记录，才能进行删除操作";
			}
			//显示弹出框
			$scope.commit = true;
		}
		//标记读取
		$scope.read = function (){
			//当前操作为标记读取
			$scope.deleteOrRead = false;
			//获取勾选的消息
			getSelectItem();
			//有消息
			if($scope.checkItem.length > 0){
				//显示确认和取消按钮
				dialogButtonOp(false);
				if($scope.checkItemCount == $scope.pageSize){
					$scope.commitMsg = "您是否确认将全部消息记录标记成已读？";
				}else{
					$scope.commitMsg = "您是否确认标记该消息记录为已读状态？标记之后，不可恢复";
				}
			}else{
				//显示知道了按钮
				dialogButtonOp(true);
				$scope.commitMsg = "您至少需选择一个消息记录，才能进行标记已读操作";
			}
			//显示弹出框
			$scope.commit = true;
		}
		//关闭弹出框
		$scope.commitCancel = function (){
			$scope.commit = false;
		}
		//确认操作
		$scope.commitConfirm = function (){
			//true表示为标记删除操作
			if($scope.deleteOrRead){
				selectcaseServices.delMessage($scope.checkItem).success(function(result, statue) {
					if (result.code == 200) {
						location.reload();
					}
				}).error(function(data, statue) {});
			}else{//false表示为标记读取操作
				selectcaseServices.readMessage($scope.checkItem).success(function(result, statue) {
					if (result.code == 200) {
						location.reload();
					}
				}).error(function(data, statue) {});
			}
			$scope.commit = false;
		}
		//勾选框点击
		$scope.flagCheckBox = function(id){
			$("input[tag='"+ id +"']").toggleClass("bor_color_brown");
		}
		//格式化读取状态
		$scope.formatRead = function (concent){
			return concent==1?"已读":"未读";
		}
		//格式化日期
		$scope.formatDate = function (concent){
			var i = concent.indexOf(' ');
			return concent.substring(0,i);
		}
		//跳转到详细信息
		$scope.gotoDetails = function (id){
			window.location.href = "#/declarationsuccess?id="+id;
		}

		$(function(){

			$("#msglist").swipe({
					swipe: function(event, direction, distance, duration, fingerCount) {
						if (direction == "left") {
								if ($scope.pageIndex == $scope.pageTotal) {
									return;
							} else {
								$scope.pageIndex +=1;
								getData($scope,selectcaseServices,$scope.pageIndex,$scope.pageSize);
							}
						} else if (direction == "right") {
							if ($scope.pageIndex ==1) {
								return;
							} else {
								$scope.pageIndex -=1;
								getData($scope,selectcaseServices,$scope.pageIndex,$scope.pageSize);
							}
						}
					}
				});

		})

});

//显示知道了或者确认取消 showOk为true显示知道了按钮  false显示确认取消按钮
function dialogButtonOp(showOk){
	if(showOk){
		$("#dialogCancel").show();
		$("#dialogConfirm").hide();
	}else{
		$("#dialogCancel").hide();
		$("#dialogConfirm").show();
	}
}

//获取消息列表
function getData($scope, selectcaseServices, pageIndex, pageSize) {
	selectcaseServices.getAllMessage(keHuId,pageIndex,pageSize).success(function(result, statue) {
		if (result.code == 200) {
			$scope.items = result.data.message;
			if($scope.items.length > 0){
				$scope.nomsg = false;
				if(result.data.pageCount % $scope.pageSize == 0){
					$scope.pageTotal = parseInt(result.data.pageCount / $scope.pageSize);
				}else{
					$scope.pageTotal = parseInt(result.data.pageCount / $scope.pageSize) + 1;
				}
			}else{
				$scope.nomsg = true;
			}
		}
	}).error(function(data, statue) {});
}

//初始化参数 测试用 发布需要删除掉
function initParam(){
	if(cityName == null || cityName.length <= 0){
		cityName='beijing';
	}
	if (keHuId == null || keHuId === "null" || keHuId.length <= 0) {
		keHuId='4028857a50613e85015063f6017a0000';
	}
}

});
